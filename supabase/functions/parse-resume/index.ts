
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobPosition } = await req.json();

    console.log('Parsing resume for position:', jobPosition);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are a professional resume parser. Extract structured information from resumes and return it as valid JSON. Focus on accuracy and completeness.

Return the data in this exact JSON format:
{
  "name": "string",
  "email": "string", 
  "phone": "string",
  "location": "string",
  "summary": "string - brief 2-3 sentence summary",
  "skills": ["array of technical skills"],
  "experience_years": number,
  "education": "string - highest degree and institution",
  "work_experience": [
    {
      "company": "string",
      "position": "string", 
      "duration": "string",
      "responsibilities": ["array of key responsibilities"],
      "technologies": ["array of technologies used"]
    }
  ],
  "certifications": ["array of certifications"],
  "key_achievements": ["array of notable achievements"],
  "linkedin_url": "string or null",
  "github_url": "string or null",
  "portfolio_url": "string or null"
}`
          },
          {
            role: 'user',
            content: `Parse this resume text and extract structured information for a ${jobPosition} position:\n\n${resumeText}`
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const parsedContent = data.choices[0].message.content;

    console.log('DeepSeek response:', parsedContent);

    // Parse the JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(parsedContent);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      throw new Error('Invalid JSON response from AI');
    }

    return new Response(JSON.stringify({ parsedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in parse-resume function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

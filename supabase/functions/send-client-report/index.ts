import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReportRequest {
  reportData: {
    job: {
      title: string;
      client_name: string;
      created_at: string;
      status: string;
    };
    candidates: Array<{
      name: string;
      email: string;
      status: string;
      applied_date: string;
    }>;
    summary: {
      totalApplications: number;
      shortlisted: number;
      interviewed: number;
      offered: number;
      hired: number;
      rejected: number;
    };
  };
  recipientEmail: string;
  notes?: string;
}

const generateReportHTML = (data: ReportRequest) => {
  const { reportData, notes } = data;
  const { job, summary, candidates } = reportData;
  
  const conversionRate = summary.totalApplications > 0 
    ? Math.round((summary.interviewed / summary.totalApplications) * 100)
    : 0;

  const recentCandidates = candidates
    .slice(0, 5)
    .map(candidate => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 8px; font-weight: 500;">${candidate.name}</td>
        <td style="padding: 12px 8px; color: #6b7280;">${candidate.email}</td>
        <td style="padding: 12px 8px;">
          <span style="
            background-color: ${candidate.status === 'hired' ? '#dcfce7' : '#f3f4f6'};
            color: ${candidate.status === 'hired' ? '#166534' : '#374151'};
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            text-transform: capitalize;
          ">
            ${candidate.status.replace('_', ' ')}
          </span>
        </td>
        <td style="padding: 12px 8px; color: #6b7280; font-size: 14px;">
          ${new Date(candidate.applied_date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </td>
      </tr>
    `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recruitment Progress Report</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #1f2937; margin: 0 0 10px 0;">Recruitment Progress Report</h1>
          <h2 style="color: #6366f1; margin: 0 0 10px 0; font-weight: 600;">${job.title}</h2>
          <p style="color: #6b7280; margin: 0; font-size: 16px;">
            Report Date: ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <!-- Job Details -->
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937;">Position Details</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <strong>Client:</strong> ${job.client_name}<br>
              <strong>Status:</strong> <span style="color: #059669;">${job.status}</span>
            </div>
            <div>
              <strong>Posted:</strong> ${new Date(job.created_at).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </div>
        </div>

        <!-- Key Metrics -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1f2937; margin-bottom: 20px;">Key Recruitment Metrics</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
            <div style="text-align: center; padding: 20px; background-color: #eff6ff; border-radius: 8px;">
              <div style="font-size: 32px; font-weight: bold; color: #1d4ed8; margin-bottom: 5px;">
                ${summary.totalApplications}
              </div>
              <div style="color: #6b7280; font-size: 14px;">Total Applications</div>
            </div>
            <div style="text-align: center; padding: 20px; background-color: #f0f9ff; border-radius: 8px;">
              <div style="font-size: 32px; font-weight: bold; color: #0369a1; margin-bottom: 5px;">
                ${summary.interviewed}
              </div>
              <div style="color: #6b7280; font-size: 14px;">Interviewed</div>
            </div>
            <div style="text-align: center; padding: 20px; background-color: #ecfdf5; border-radius: 8px;">
              <div style="font-size: 32px; font-weight: bold; color: #059669; margin-bottom: 5px;">
                ${summary.hired}
              </div>
              <div style="color: #6b7280; font-size: 14px;">Successfully Hired</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <div style="text-align: center; padding: 15px; background-color: #fefce8; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #ca8a04; margin-bottom: 5px;">
                ${summary.shortlisted}
              </div>
              <div style="color: #6b7280; font-size: 14px;">In Screening</div>
            </div>
            <div style="text-align: center; padding: 15px; background-color: #fff7ed; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #ea580c; margin-bottom: 5px;">
                ${summary.offered}
              </div>
              <div style="color: #6b7280; font-size: 14px;">Offers Extended</div>
            </div>
            <div style="text-align: center; padding: 15px; background-color: #fef2f2; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 5px;">
                ${summary.rejected}
              </div>
              <div style="color: #6b7280; font-size: 14px;">Not Proceeding</div>
            </div>
          </div>
        </div>

        <!-- Executive Summary -->
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #1f2937; margin: 0 0 20px 0;">Executive Summary</h3>
          <div style="color: #4b5563; line-height: 1.8;">
            <p style="margin: 0 0 15px 0;">
              Here's the latest recruitment progress for the <strong>${job.title}</strong> position:
            </p>
            
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">✅ Received <strong>${summary.totalApplications}</strong> total applications</li>
              <li style="margin-bottom: 8px;">👥 <strong>${summary.shortlisted}</strong> candidates are currently in screening</li>
              <li style="margin-bottom: 8px;">📅 <strong>${summary.interviewed}</strong> candidates have been interviewed</li>
              ${summary.hired > 0 ? `<li style="margin-bottom: 8px;">🎉 <strong>${summary.hired}</strong> candidates have been successfully hired</li>` : ''}
            </ul>

            ${summary.totalApplications > 0 ? `
              <div style="background-color: #e0e7ff; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <strong>Conversion Rate:</strong> ${conversionRate}% of applicants reached the interview stage
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Recent Candidates -->
        ${candidates.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937; margin-bottom: 20px;">Recent Candidate Activity</h3>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151;">Name</th>
                    <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151;">Email</th>
                    <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151;">Status</th>
                    <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151;">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentCandidates}
                </tbody>
              </table>
            </div>
            ${candidates.length > 5 ? `
              <p style="color: #6b7280; font-size: 14px; margin-top: 10px; text-align: center;">
                Showing 5 most recent candidates out of ${candidates.length} total
              </p>
            ` : ''}
          </div>
        ` : ''}

        ${notes ? `
          <!-- Additional Notes -->
          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #92400e; margin: 0 0 15px 0;">Additional Notes</h3>
            <p style="color: #78350f; margin: 0; line-height: 1.6;">${notes}</p>
          </div>
        ` : ''}

        <!-- Footer -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280;">
          <p style="margin: 0; font-size: 14px;">
            This report was automatically generated by your recruitment team.<br>
            For questions or additional information, please contact your dedicated recruiter.
          </p>
          <p style="margin: 15px 0 0 0; font-size: 12px;">
            Report generated on ${new Date().toLocaleString('en-US', { 
              timeZone: 'UTC',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short'
            })}
          </p>
        </div>
      </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ReportRequest = await req.json();
    const { reportData, recipientEmail, notes } = requestData;

    const emailHtml = generateReportHTML(requestData);

    const emailResponse = await resend.emails.send({
      from: "Recruitment Team <reports@resend.dev>",
      to: [recipientEmail],
      subject: `Recruitment Progress Report - ${reportData.job.title}`,
      html: emailHtml,
    });

    console.log("Report email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending recruitment report:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
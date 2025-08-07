# Task Management & Calendar System

## Overview
The Scorecard ATS task management system provides recruiters with a comprehensive todo list and calendar interface to organize their daily activities, follow-ups, interview scheduling, and candidate outreach tasks. The system integrates seamlessly with the candidate pipeline to automatically generate tasks and reminders.

---

## 🎯 Core Features

### 1. **Task Management**
- **Task Creation**: Manual and automated task generation
- **Task Categories**: Follow-ups, interviews, outreach, administrative
- **Priority Levels**: High, medium, low priority classification
- **Due Dates**: Deadline tracking with overdue notifications
- **Task Status**: Todo, in-progress, completed, cancelled

### 2. **Calendar Views**
- **Monthly View**: Overview of all tasks and events for the month
- **Weekly View**: Detailed week planning with time slots
- **Daily View**: Hour-by-hour task scheduling and management
- **Agenda View**: List-based task and event overview

### 3. **Integration Features**
- **Candidate Pipeline Integration**: Auto-generate tasks from pipeline actions
- **Interview Scheduling**: Sync with Zoom and Google Calendar
- **Outreach Sequences**: Tasks generated from email/SMS sequences
- **Follow-up Reminders**: Automated follow-up task creation

---

## 🏗️ Data Models

### Task Structure
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  
  // Associations
  candidateId?: string;
  jobId?: string;
  assignedTo: string; // User ID
  createdBy: string; // User ID
  
  // Metadata
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  tags: string[];
  
  // Integration data
  zoomMeetingId?: string;
  calendarEventId?: string;
  sequenceStepId?: string;
  
  // Reminders
  reminders: TaskReminder[];
  
  // Subtasks
  subtasks: SubTask[];
}

enum TaskCategory {
  FOLLOW_UP = 'follow_up',
  INTERVIEW = 'interview',
  OUTREACH = 'outreach',
  ADMIN = 'admin',
  CALL = 'call',
  EMAIL = 'email',
  SMS = 'sms',
  LINKEDIN = 'linkedin',
  RESEARCH = 'research',
  MEETING = 'meeting'
}

enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

interface TaskReminder {
  id: string;
  taskId: string;
  reminderTime: Date;
  type: 'email' | 'push' | 'sms';
  sent: boolean;
  message: string;
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // Every N days/weeks/months
  daysOfWeek?: number[]; // For weekly recurrence
  endDate?: Date;
  maxOccurrences?: number;
}
```

### Calendar Event Structure
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  
  // Event type
  type: 'task' | 'interview' | 'meeting' | 'reminder' | 'deadline';
  
  // Associations
  taskId?: string;
  candidateId?: string;
  jobId?: string;
  
  // Integration
  zoomMeetingId?: string;
  googleCalendarEventId?: string;
  
  // Attendees
  attendees: EventAttendee[];
  
  // Metadata
  location?: string;
  isRecurring: boolean;
  recurrenceId?: string;
  color: string;
  
  // Status
  status: 'confirmed' | 'tentative' | 'cancelled';
}

interface EventAttendee {
  email: string;
  name: string;
  role: 'organizer' | 'attendee' | 'candidate';
  responseStatus: 'accepted' | 'declined' | 'tentative' | 'pending';
}
```

---

## 🎨 UI Components

### 1. Calendar Header
```typescript
const CalendarHeader = () => {
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="calendar-header flex justify-between items-center p-4 border-b">
      <div className="date-navigation flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        
        <Button 
          variant="outline" 
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </Button>
      </div>
      
      <div className="view-controls flex gap-2">
        <Button 
          variant={currentView === 'day' ? 'default' : 'outline'}
          onClick={() => setCurrentView('day')}
        >
          Day
        </Button>
        <Button 
          variant={currentView === 'week' ? 'default' : 'outline'}
          onClick={() => setCurrentView('week')}
        >
          Week
        </Button>
        <Button 
          variant={currentView === 'month' ? 'default' : 'outline'}
          onClick={() => setCurrentView('month')}
        >
          Month
        </Button>
      </div>
      
      <div className="actions flex gap-2">
        <Button onClick={() => setShowTaskModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>
    </div>
  );
};
```

### 2. Monthly Calendar View
```typescript
const MonthlyCalendarView = ({ currentDate, tasks, events }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="monthly-calendar grid grid-cols-7 gap-1 p-4">
      {/* Week headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center font-medium p-2 text-gray-500">
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {days.map(day => (
        <CalendarDay 
          key={day.toISOString()}
          date={day}
          tasks={getTasksForDay(tasks, day)}
          events={getEventsForDay(events, day)}
          isCurrentMonth={isSameMonth(day, currentDate)}
          isToday={isToday(day)}
          onClick={() => handleDayClick(day)}
        />
      ))}
    </div>
  );
};

const CalendarDay = ({ date, tasks, events, isCurrentMonth, isToday, onClick }) => {
  const dayTasks = tasks.slice(0, 3); // Show max 3 tasks
  const hasMoreTasks = tasks.length > 3;

  return (
    <div 
      className={`calendar-day min-h-[120px] p-2 border cursor-pointer hover:bg-gray-50 ${
        !isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''
      } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
      onClick={onClick}
    >
      <div className={`day-number font-medium mb-1 ${
        isToday ? 'text-blue-600' : ''
      }`}>
        {format(date, 'd')}
      </div>
      
      <div className="tasks-container space-y-1">
        {dayTasks.map(task => (
          <TaskChip 
            key={task.id}
            task={task}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleTaskClick(task);
            }}
          />
        ))}
        
        {hasMoreTasks && (
          <div className="text-xs text-gray-500">
            +{tasks.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};
```

### 3. Weekly Calendar View
```typescript
const WeeklyCalendarView = ({ currentDate, tasks, events }) => {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="weekly-calendar">
      {/* Week header */}
      <div className="week-header grid grid-cols-8 border-b">
        <div className="time-column w-16"></div>
        {days.map(day => (
          <div key={day.toISOString()} className="day-header text-center p-2">
            <div className="day-name text-sm text-gray-500">
              {format(day, 'EEE')}
            </div>
            <div className={`day-number text-lg font-medium ${
              isToday(day) ? 'text-blue-600' : ''
            }`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      
      {/* Time slots */}
      <div className="time-slots grid grid-cols-8">
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="time-label w-16 p-2 text-sm text-gray-500 border-r">
              {format(new Date().setHours(hour, 0), 'ha')}
            </div>
            {days.map(day => (
              <TimeSlot 
                key={`${day.toISOString()}-${hour}`}
                date={day}
                hour={hour}
                tasks={getTasksForHour(tasks, day, hour)}
                events={getEventsForHour(events, day, hour)}
                onTaskCreate={(time) => handleTaskCreate(time)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const TimeSlot = ({ date, hour, tasks, events, onTaskCreate }) => {
  const slotTime = new Date(date);
  slotTime.setHours(hour, 0, 0, 0);

  return (
    <div 
      className="time-slot h-12 border-b border-r p-1 hover:bg-gray-50 cursor-pointer"
      onClick={() => onTaskCreate(slotTime)}
    >
      {tasks.map(task => (
        <TaskBlock key={task.id} task={task} />
      ))}
      {events.map(event => (
        <EventBlock key={event.id} event={event} />
      ))}
    </div>
  );
};
```

### 4. Daily Calendar View
```typescript
const DailyCalendarView = ({ currentDate, tasks, events }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayTasks = getTasksForDay(tasks, currentDate);
  const dayEvents = getEventsForDay(events, currentDate);

  return (
    <div className="daily-calendar flex">
      {/* Time column */}
      <div className="time-column w-20 border-r">
        {hours.map(hour => (
          <div key={hour} className="hour-slot h-16 p-2 border-b text-sm text-gray-500">
            {format(new Date().setHours(hour, 0), 'ha')}
          </div>
        ))}
      </div>
      
      {/* Day column */}
      <div className="day-column flex-1">
        <div className="day-header p-4 border-b">
          <h3 className="text-lg font-medium">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="task-summary text-sm text-gray-500 mt-1">
            {dayTasks.length} tasks, {dayEvents.length} events
          </div>
        </div>
        
        <div className="hour-slots">
          {hours.map(hour => (
            <DayTimeSlot 
              key={hour}
              date={currentDate}
              hour={hour}
              tasks={getTasksForHour(dayTasks, currentDate, hour)}
              events={getEventsForHour(dayEvents, currentDate, hour)}
            />
          ))}
        </div>
      </div>
      
      {/* Task sidebar */}
      <div className="task-sidebar w-80 border-l p-4">
        <h4 className="font-medium mb-4">Today's Tasks</h4>
        <TaskList 
          tasks={dayTasks}
          onTaskComplete={handleTaskComplete}
          onTaskEdit={handleTaskEdit}
        />
      </div>
    </div>
  );
};
```

### 5. Task Creation Modal
```typescript
const TaskModal = ({ isOpen, onClose, initialData, candidateId, jobId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: TaskCategory.FOLLOW_UP,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date(),
    estimatedDuration: 30,
    candidateId: candidateId || '',
    jobId: jobId || '',
    reminders: [{ type: 'email', minutesBefore: 30 }],
    isRecurring: false,
    tags: []
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input 
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Follow up with John Doe"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskCategory).map(category => (
                    <SelectItem key={category} value={category}>
                      {category.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Task details..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority}
                onValueChange={(value) => setFormData({...formData, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input 
                id="dueDate"
                type="datetime-local"
                value={format(formData.dueDate, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setFormData({...formData, dueDate: new Date(e.target.value)})}
              />
            </div>
            
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration"
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({...formData, estimatedDuration: parseInt(e.target.value)})}
                min="5"
                step="5"
              />
            </div>
          </div>
          
          {/* Candidate and Job selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="candidate">Related Candidate</Label>
              <CandidateSelect 
                value={formData.candidateId}
                onChange={(candidateId) => setFormData({...formData, candidateId})}
              />
            </div>
            
            <div>
              <Label htmlFor="job">Related Job</Label>
              <JobSelect 
                value={formData.jobId}
                onChange={(jobId) => setFormData({...formData, jobId})}
              />
            </div>
          </div>
          
          {/* Reminders */}
          <div>
            <Label>Reminders</Label>
            <ReminderSettings 
              reminders={formData.reminders}
              onChange={(reminders) => setFormData({...formData, reminders})}
            />
          </div>
          
          {/* Recurring options */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData({...formData, isRecurring: checked})}
            />
            <Label htmlFor="recurring">Make this a recurring task</Label>
          </div>
          
          {formData.isRecurring && (
            <RecurrenceSettings 
              pattern={formData.recurrencePattern}
              onChange={(pattern) => setFormData({...formData, recurrencePattern: pattern})}
            />
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 🔄 Automated Task Generation

### Pipeline Integration
```typescript
class TaskAutomationService {
  // Generate tasks when candidate moves through pipeline
  async onCandidateStageChange(candidateId: string, fromStage: string, toStage: string) {
    const candidate = await this.candidateService.getCandidate(candidateId);
    const recruiter = await this.userService.getUser(candidate.assignedRecruiter);
    
    switch (toStage) {
      case 'sourced':
        await this.createTask({
          title: `Initial outreach to ${candidate.name}`,
          category: TaskCategory.OUTREACH,
          priority: TaskPriority.HIGH,
          dueDate: addDays(new Date(), 1),
          candidateId,
          assignedTo: recruiter.id
        });
        break;
        
      case 'initial_screening':
        await this.createTask({
          title: `Schedule screening call with ${candidate.name}`,
          category: TaskCategory.CALL,
          priority: TaskPriority.HIGH,
          dueDate: addDays(new Date(), 2),
          candidateId,
          assignedTo: recruiter.id
        });
        break;
        
      case 'interview_center':
        // This is handled by the automated interview system
        await this.createTask({
          title: `Review AI-generated questions for ${candidate.name}`,
          category: TaskCategory.INTERVIEW,
          priority: TaskPriority.MEDIUM,
          dueDate: addHours(new Date(), 2),
          candidateId,
          assignedTo: recruiter.id
        });
        break;
    }
  }
  
  // Generate follow-up tasks based on communication
  async onCommunicationSent(type: 'email' | 'sms' | 'linkedin', candidateId: string) {
    const candidate = await this.candidateService.getCandidate(candidateId);
    
    await this.createTask({
      title: `Follow up on ${type} sent to ${candidate.name}`,
      category: TaskCategory.FOLLOW_UP,
      priority: TaskPriority.MEDIUM,
      dueDate: addDays(new Date(), 3), // Follow up in 3 days
      candidateId,
      assignedTo: candidate.assignedRecruiter
    });
  }
  
  // Generate tasks from outreach sequences
  async onSequenceStepDue(sequenceStepId: string, candidateId: string) {
    const step = await this.sequenceService.getStep(sequenceStepId);
    const candidate = await this.candidateService.getCandidate(candidateId);
    
    if (step.type === 'manual_task') {
      await this.createTask({
        title: step.taskTitle,
        description: step.taskDescription,
        category: TaskCategory.FOLLOW_UP,
        priority: step.priority,
        dueDate: step.dueDate,
        candidateId,
        assignedTo: candidate.assignedRecruiter,
        sequenceStepId
      });
    }
  }
}
```

### Smart Task Suggestions
```typescript
class TaskSuggestionService {
  async generateSmartSuggestions(userId: string): Promise<TaskSuggestion[]> {
    const suggestions: TaskSuggestion[] = [];
    
    // Candidates without recent activity
    const stagnantCandidates = await this.getStagnantCandidates(userId);
    stagnantCandidates.forEach(candidate => {
      suggestions.push({
        type: 'follow_up',
        title: `Follow up with ${candidate.name}`,
        description: `No activity for ${candidate.daysSinceLastContact} days`,
        priority: TaskPriority.MEDIUM,
        candidateId: candidate.id
      });
    });
    
    // Interviews without feedback
    const pendingFeedback = await this.getInterviewsWithoutFeedback(userId);
    pendingFeedback.forEach(interview => {
      suggestions.push({
        type: 'admin',
        title: `Complete interview feedback for ${interview.candidateName}`,
        description: `Interview completed ${interview.daysAgo} days ago`,
        priority: TaskPriority.HIGH,
        candidateId: interview.candidateId
      });
    });
    
    return suggestions;
  }
}
```

---

## 📊 Analytics & Reporting

### Task Performance Metrics
```typescript
interface TaskAnalytics {
  completionRate: number;
  averageCompletionTime: number; // hours
  overdueTasksCount: number;
  tasksByCategory: Record<TaskCategory, number>;
  tasksByPriority: Record<TaskPriority, number>;
  productivityScore: number; // 0-100
  
  // Time-based metrics
  tasksCompletedToday: number;
  tasksCompletedThisWeek: number;
  tasksCompletedThisMonth: number;
  
  // Efficiency metrics
  estimatedVsActualTime: {
    category: TaskCategory;
    estimatedAvg: number;
    actualAvg: number;
    variance: number;
  }[];
}
```

This comprehensive task management and calendar system will dramatically improve recruiter organization and productivity, providing a centralized hub for all recruiting activities with intelligent automation and beautiful calendar interfaces!

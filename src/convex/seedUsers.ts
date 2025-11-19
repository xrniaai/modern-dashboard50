import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seedMockUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if users already exist to avoid duplicates
    const existingUsers = await ctx.db.query("users").collect();
    const existingEmails = new Set(existingUsers.map(u => u.email));

    const mockUsers = [
      {
        name: "Ananya",
        email: "ananya@paidvine.test",
        role: "user" as const,
        isAnonymous: false,
        emailVerificationTime: Date.now(),
      },
      {
        name: "Rajesh",
        email: "rajesh@paidvine.test",
        role: "user" as const,
        isAnonymous: false,
        emailVerificationTime: Date.now(),
      },
      {
        name: "Maya",
        email: "maya@paidvine.test",
        role: "user" as const,
        isAnonymous: false,
        emailVerificationTime: Date.now(),
      },
      {
        name: "Carlos",
        email: "carlos@paidvine.test",
        role: "user" as const,
        isAnonymous: false,
        emailVerificationTime: Date.now(),
      },
      {
        name: "Sarah",
        email: "sarah@paidvine.test",
        role: "user" as const,
        isAnonymous: false,
        emailVerificationTime: Date.now(),
      },
      {
        name: "Omar",
        email: "omar@paidvine.test",
        role: "user" as const,
        isAnonymous: false,
        emailVerificationTime: Date.now(),
      },
      {
        name: "Priya",
        email: "priya@paidvine.test",
        role: "user" as const,
        isAnonymous: false,
        emailVerificationTime: Date.now(),
      },
      {
        name: "TestAdmin",
        email: "admin@paidvine.test",
        role: "admin" as const,
        isAnonymous: false,
        emailVerificationTime: Date.now(),
      },
    ];

    const createdUsers = [];

    for (const user of mockUsers) {
      if (!existingEmails.has(user.email)) {
        const userId = await ctx.db.insert("users", user);
        createdUsers.push({ ...user, _id: userId });
      }
    }

    // Create comprehensive mock available surveys
    const mockAvailableSurveys = [
      {
        title: "Tech Product Feedback Survey",
        description: "Share your thoughts on the latest tech gadgets and help shape future products",
        category: "Technology",
        points: 250,
        estimatedMinutes: 10,
        questions: [
          {
            id: "q1",
            type: "multiple_choice" as const,
            question: "Which tech product category interests you most?",
            options: ["Smartphones", "Laptops", "Wearables", "Smart Home Devices"],
            required: true,
          },
          {
            id: "q2",
            type: "rating" as const,
            question: "How satisfied are you with your current smartphone?",
            required: true,
          },
          {
            id: "q3",
            type: "text" as const,
            question: "What feature would you like to see in future tech products?",
            required: false,
          },
        ],
        isActive: true,
      },
      {
        title: "Shopping Habits & Preferences",
        description: "Tell us about your online shopping preferences and help improve e-commerce experiences",
        category: "Retail",
        points: 200,
        estimatedMinutes: 8,
        questions: [
          {
            id: "q1",
            type: "multiple_choice" as const,
            question: "How often do you shop online?",
            options: ["Daily", "Weekly", "Monthly", "Rarely"],
            required: true,
          },
          {
            id: "q2",
            type: "multiple_choice" as const,
            question: "What's most important when shopping online?",
            options: ["Price", "Fast Shipping", "Product Quality", "Customer Reviews"],
            required: true,
          },
          {
            id: "q3",
            type: "rating" as const,
            question: "Rate your overall online shopping experience",
            required: true,
          },
          {
            id: "q4",
            type: "text" as const,
            question: "What would improve your online shopping experience?",
            required: false,
          },
        ],
        isActive: true,
      },
      {
        title: "Entertainment & Media Consumption",
        description: "What do you watch and listen to? Help us understand entertainment trends",
        category: "Entertainment",
        points: 150,
        estimatedMinutes: 5,
        questions: [
          {
            id: "q1",
            type: "multiple_choice" as const,
            question: "Which streaming service do you use most?",
            options: ["Netflix", "Disney+", "Amazon Prime", "YouTube", "Other"],
            required: true,
          },
          {
            id: "q2",
            type: "multiple_choice" as const,
            question: "What type of content do you prefer?",
            options: ["Movies", "TV Series", "Documentaries", "Short Videos"],
            required: true,
          },
          {
            id: "q3",
            type: "rating" as const,
            question: "How satisfied are you with current streaming options?",
            required: true,
          },
        ],
        isActive: true,
      },
      {
        title: "Health & Wellness Check-In",
        description: "Quick survey about your wellness routine and health habits",
        category: "Health",
        points: 300,
        estimatedMinutes: 15,
        questions: [
          {
            id: "q1",
            type: "multiple_choice" as const,
            question: "How often do you exercise per week?",
            options: ["Never", "1-2 times", "3-4 times", "5+ times"],
            required: true,
          },
          {
            id: "q2",
            type: "rating" as const,
            question: "Rate your overall health and wellness",
            required: true,
          },
          {
            id: "q3",
            type: "multiple_choice" as const,
            question: "What's your biggest health challenge?",
            options: ["Time Management", "Motivation", "Access to Resources", "Knowledge"],
            required: true,
          },
          {
            id: "q4",
            type: "text" as const,
            question: "What wellness goals are you working towards?",
            required: false,
          },
        ],
        isActive: true,
      },
      {
        title: "Travel Experience Survey",
        description: "Share your recent travel experiences and preferences",
        category: "Travel",
        points: 400,
        estimatedMinutes: 20,
        questions: [
          {
            id: "q1",
            type: "multiple_choice" as const,
            question: "How often do you travel for leisure?",
            options: ["Monthly", "Quarterly", "Annually", "Rarely"],
            required: true,
          },
          {
            id: "q2",
            type: "multiple_choice" as const,
            question: "What type of accommodation do you prefer?",
            options: ["Hotels", "Airbnb", "Hostels", "Resorts"],
            required: true,
          },
          {
            id: "q3",
            type: "rating" as const,
            question: "Rate your last travel experience",
            required: true,
          },
          {
            id: "q4",
            type: "text" as const,
            question: "What's your dream travel destination and why?",
            required: false,
          },
          {
            id: "q5",
            type: "multiple_choice" as const,
            question: "How do you typically book travel?",
            options: ["Travel Agency", "Online Booking Sites", "Direct with Provider", "Mobile Apps"],
            required: true,
          },
        ],
        isActive: true,
      },
    ];

    // Check if surveys already exist
    const existingSurveys = await ctx.db.query("availableSurveys").collect();
    const createdSurveys = [];

    if (existingSurveys.length === 0 || existingSurveys.every(s => !s.isActive)) {
      for (const survey of mockAvailableSurveys) {
        const surveyId = await ctx.db.insert("availableSurveys", survey);
        createdSurveys.push({ ...survey, _id: surveyId });
      }
    }

    // Create survey history data
    const surveyData = [
      { email: "ananya@paidvine.test", surveys: [
        { title: "Mobile App Feedback", description: "Share your thoughts on mobile apps", points: 850, status: "completed" as const },
        { title: "Daily Survey", description: "Quick daily questions", points: 500, status: "completed" as const },
        { title: "Tech Product Review", description: "Review latest tech products", points: 500, status: "completed" as const },
      ]},
      { email: "rajesh@paidvine.test", surveys: [
        { title: "IT Industry Survey", description: "High-value IT professional survey", points: 2000, status: "completed" as const },
        { title: "Software Development Feedback", description: "Developer experience survey", points: 1200, status: "completed" as const },
        { title: "Enterprise Solutions", description: "B2B software feedback", points: 1000, status: "completed" as const },
      ]},
      { email: "maya@paidvine.test", surveys: [
        { title: "Travel Experience", description: "Share your travel experiences", points: 480, status: "completed" as const },
        { title: "Commute Survey", description: "Daily commute habits", points: 500, status: "completed" as const },
      ]},
      { email: "carlos@paidvine.test", surveys: [
        { title: "Food Taste Test", description: "Rate new food products", points: 300, status: "completed" as const },
      ]},
      { email: "sarah@paidvine.test", surveys: [
        { title: "Premium Survey Pack 1", description: "High-value survey bundle", points: 3000, status: "completed" as const },
        { title: "Premium Survey Pack 2", description: "High-value survey bundle", points: 3000, status: "completed" as const },
        { title: "Premium Survey Pack 3", description: "High-value survey bundle", points: 3000, status: "completed" as const },
        { title: "Premium Survey Pack 4", description: "High-value survey bundle", points: 3250, status: "completed" as const },
      ]},
      { email: "omar@paidvine.test", surveys: [
        { title: "B2B Business Survey", description: "Business owner feedback", points: 540, status: "completed" as const },
      ]},
      { email: "admin@paidvine.test", surveys: [
        { title: "Admin Test Survey", description: "Testing purposes", points: 99999, status: "completed" as const },
      ]},
    ];

    // Create a dummy availableSurvey to link completed surveys to
    const dummySurveyId = await ctx.db.insert("availableSurveys", {
      title: "Historical Survey",
      description: "Completed survey from history",
      category: "General",
      points: 0,
      estimatedMinutes: 0,
      questions: [],
      isActive: false,
    });

    for (const userData of surveyData) {
      const user = createdUsers.find(u => u.email === userData.email) || 
                   existingUsers.find(u => u.email === userData.email);
      
      if (user) {
        for (const survey of userData.surveys) {
          await ctx.db.insert("surveys", {
            userId: user._id,
            surveyId: dummySurveyId,
            title: survey.title,
            description: survey.description,
            pointsEarned: survey.points,
            status: survey.status,
            completedAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
          });
        }
      }
    }

    return {
      message: `Successfully seeded ${createdUsers.length} new users, ${createdSurveys.length} available surveys, and survey history data`,
      users: createdUsers.map(u => ({ name: u.name, email: u.email, role: u.role })),
      surveys: createdSurveys.length,
    };
  },
});
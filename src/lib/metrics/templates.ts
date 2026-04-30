export type DashboardTemplate = {
  name: string;
  description: string;
  metricKeys: string[];
  welcomeMessage: string;
};

export const BUSINESS_TEMPLATES: Record<string, DashboardTemplate> = {
  FREELANCER: {
    name: "Freelancer / Consultant",
    description: "Track income, clients, hours, and profitability.",
    metricKeys: [
      "monthly_revenue",
      "active_clients",
      "billable_hours",
      "effective_hourly_rate",
      "outstanding_invoices",
      "profit_margin",
    ],
    welcomeMessage: "Your freelance dashboard is ready. Log your first project revenue to see trends.",
  },
  SIDE_HUSTLE: {
    name: "Side Hustle",
    description: "Multiple income streams, time vs. earnings, tax estimates.",
    metricKeys: [
      "total_income",
      "income_source_1",
      "income_source_2",
      "hours_worked",
      "effective_hourly_rate",
      "monthly_expenses",
      "tax_estimate",
    ],
    welcomeMessage: "Your side hustle dashboard is ready. Add your income sources to start tracking.",
  },
  ECOMMERCE: {
    name: "Ecommerce Store",
    description: "Orders, revenue, AOV, conversion, and refunds.",
    metricKeys: [
      "monthly_revenue",
      "total_orders",
      "average_order_value",
      "conversion_rate",
      "refund_rate",
      "new_customers",
    ],
    welcomeMessage: "Your ecommerce dashboard is ready. Connect Shopify or log your first sale.",
  },
  SERVICE_BUSINESS: {
    name: "Service Business",
    description: "Revenue, jobs, leads, close rate, and profitability.",
    metricKeys: [
      "monthly_revenue",
      "active_clients",
      "close_rate",
      "profit_margin",
      "monthly_expenses",
      "outstanding_invoices",
    ],
    welcomeMessage: "Your service business dashboard is ready.",
  },
  SAAS: {
    name: "SaaS / Subscription",
    description: "MRR, churn, LTV, CAC, and growth.",
    metricKeys: [
      "mrr",
      "arr",
      "new_customers",
      "churn_rate",
      "customer_ltv",
      "cac",
    ],
    welcomeMessage: "Your SaaS dashboard is ready. Connect Stripe to auto-sync your MRR.",
  },
  CREATOR: {
    name: "Creator / Influencer",
    description: "Platform revenue, subscribers, content performance.",
    metricKeys: [
      "monthly_revenue",
      "email_subscribers",
      "social_followers",
      "content_pieces",
      "views",
      "website_visitors",
    ],
    welcomeMessage: "Your creator dashboard is ready. Start logging your platform income.",
  },
  CUSTOM: {
    name: "Custom",
    description: "Start blank and add the metrics that matter to you.",
    metricKeys: [],
    welcomeMessage: "Your blank dashboard is ready. Browse the metric library to add your first widget.",
  },
};

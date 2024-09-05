export const filterOptions = [
  {
    id: "all",
    filterId: "ALL",
    name: "All",
    description: "view all tickets",
    icon: "inboxStack",
  },
  {
    id: "open",
    filterId: "OPEN",
    name: "Open",
    description: "view unresolved tickets only",
    icon: "envelope",
  },
  {
    id: "resolved",
    filterId: "RESOLVED",
    name: "Resolved",
    description: "view resolved tickets only",
    icon: "envelopeOpen",
  },
  {
    id: "inProcess",
    filterId: "INPROCESS",
    name: "In Process",
    description: "view processing tickets only",
    icon: "wrenchScrewdriver",
  },
];

export const headings = [
  "title",
  "description",
  "category",
  "priority",
  "createdAt",
  "updatedAt",
];

export const mapHeadings = {
  title: "Title",
  description: "Description",
  category: "category",
  priority: "Priority",
  createdAt: "Created At",
  updatedAt: "Updated At",
};

export const priorityOptions = [
  { id: "low", name: "Low" },
  { id: "high", name: "High" },
  { id: "urgent", name: "Urgent" },
  { id: "immediate", name: "Immediate" },
];

export const categoryOptions = [
  { id: "manageAccount", name: "Manage Account" },
  { id: "manageSoftware", name: "Manage Software" },
  { id: "security", name: "Security" },
];

export const markAsOptions = [
  {
    id: "open",
    filterId: "OPEN",
    name: "Open",
  },
  {
    id: "resolved",
    filterId: "RESOLVED",
    name: "Resolved",
  },
  {
    id: "inProcess",
    filterId: "INPROCESS",
    name: "In Process",
  },
];

export const filterIdMap = {
  open: "OPEN",
  resolved: "RESOLVED",
  inProcess: "INPROCESS",
};

export const filterName = {
  Open: "Open",
  Resolved: "Resolved",
  Inprocess: "In Process",
};

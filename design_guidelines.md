# WhatsApp Bot Admin Interface Design Guidelines

## Design Approach

**System-Based Approach**: Modern developer dashboard inspired by Linear, Vercel, and GitHub's admin interfaces - prioritizing clarity, efficiency, and data visibility.

**Key Principles**:
- Information hierarchy over decoration
- Instant comprehension of bot status and activity
- Minimal friction for configuration changes
- Professional, trustworthy aesthetic

---

## Typography

**Font Stack**: 
- Primary: Inter orSystem UI (via Google Fonts CDN)
- Monospace: JetBrains Mono for message content and IDs

**Hierarchy**:
- Page titles: text-2xl font-semibold
- Section headers: text-lg font-medium
- Body text: text-base
- Metadata/timestamps: text-sm text-gray-600
- Message content: text-sm font-mono

---

## Layout System

**Spacing**: Consistent use of Tailwind units 4, 6, 8, 12, 16
- Component padding: p-6
- Section gaps: space-y-8
- Card spacing: p-4 to p-6
- Between elements: gap-4

**Container**: max-w-7xl mx-auto px-6 for all main content

---

## Component Library

### Dashboard Layout
**Header**: Full-width with bot status indicator, configuration button, and connection status (Twilio API)

**Main Content Area**: Two-column layout on desktop (lg:grid-cols-3)
- Left column (2/3): Message log/activity feed
- Right sidebar (1/3): Quick stats, auto-reply settings

### Message Log
**Table-based display** with columns:
- Timestamp (text-sm text-gray-500)
- From (phone number with country flag if available)
- Message preview (truncated, font-mono)
- Status badge (sent/received/failed)
- Expand/collapse for full message view

**Rows**: Alternating subtle background (even:bg-gray-50), hover:bg-gray-100, border-b border-gray-200

### Configuration Panel
**Card-based sections** (bg-white border border-gray-200 rounded-lg p-6):

1. **Auto-Reply Toggle**: Large switch with label and description
2. **Reply Message Editor**: Textarea with character count, supports variables like {name}, {time}
3. **Response Delay**: Slider input (0-30 seconds) to simulate natural typing
4. **Active Hours**: Time range selector (optional quiet hours)

### Status Indicators
**Connection Status**: Green dot + "Connected" or Red dot + "Disconnected" in header
**Bot Status**: Toggle switch with clear ON/OFF states (bg-green-500 when active)
**Message Badges**: Small rounded pills (px-2 py-1 rounded-full text-xs) - Success: green, Error: red, Pending: yellow

### Statistics Cards
**3-4 metric cards** in grid (grid-cols-2 gap-4):
- Total messages received (24h/7d)
- Auto-replies sent
- Response rate
- Average response time

Each card: Large number (text-3xl font-bold), small label below (text-sm text-gray-600), subtle trend indicator if applicable

### Test Interface
**Compact card** with:
- Phone number input field
- Message textarea
- "Send Test Message" button
- Recent test results display below

---

## Interaction Patterns

**Real-time Updates**: Message log auto-updates when new messages arrive (subtle highlight animation on new rows)

**Inline Editing**: Click message template to edit directly, save/cancel buttons appear

**Expandable Details**: Click message row to expand and show full content, metadata, delivery status

---

## Forms & Inputs

**Text Inputs**: border border-gray-300 rounded-md px-3 py-2, focus:ring-2 focus:ring-blue-500 focus:border-transparent

**Textareas**: Same styling as inputs, min-h-24 for message templates

**Buttons**:
- Primary: Solid background, medium size (px-4 py-2)
- Secondary: Border outline style
- Destructive actions: Use with confirmation modal

**Toggle Switches**: Large, clear on/off states with smooth transition

---

## No Images Required

This is a functional admin interface - no hero images or decorative imagery needed. Focus is on data clarity and operational efficiency.

---

## Additional Elements

**Empty States**: When no messages exist, show centered illustration placeholder with "No messages yet" text and "Send a test message" CTA

**Loading States**: Skeleton loaders for message rows, spinner for API calls

**Error Handling**: Toast notifications (top-right) for API errors, inline validation messages for form fields

**Footer**: Minimal - Twilio connection status, API version, last sync timestamp
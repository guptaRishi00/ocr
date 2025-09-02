# OCR Database Setup Documentation

This document describes the organized database setup for storing and managing Gemini OCR responses.

## 📁 File Structure

```
src/
├── lib/
│   ├── database.ts          # Prisma client configuration
│   └── ocrService.ts        # OCR database service layer
├── hooks/
│   ├── useOcrResponses.ts   # Hook for fetching OCR responses
│   ├── useOcrStats.ts       # Hook for OCR statistics
│   └── useOcrMutation.ts    # Hook for OCR mutations (create, delete)
├── components/
│   ├── OcrResponsesList.tsx # Component for displaying saved responses
│   └── OcrStats.tsx         # Component for displaying statistics
└── app/api/
    ├── ocr/route.ts         # Updated OCR endpoint (saves to DB)
    └── ocr-responses/
        ├── route.ts         # List OCR responses (GET)
        ├── search/route.ts  # Search OCR responses (GET)
        ├── stats/route.ts   # OCR statistics (GET)
        └── [id]/route.ts    # Get/Delete individual response
```

## 🗄️ Database Schema

### OcrResponse Model
```prisma
model OcrResponse {
  id             Int      @id @default(autoincrement())
  originalName   String?  // Original filename of uploaded image
  extractedText  String   @db.Text
  imageSize      Int?     // Size of the image in bytes
  mimeType       String?  // MIME type of the image
  processingTime Int?     // Time taken to process in milliseconds
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("ocr_responses")
}
```

## 🔧 Setup Instructions

1. **Environment Variables** (create `.env` file):
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/ocr_db"
GEMINI_API_KEY=your_gemini_api_key_here
```

2. **Run Database Migration**:
```bash
bunx prisma migrate dev --name add-ocr-responses
bunx prisma generate
```

3. **Start Development Server**:
```bash
bun dev
```

## 🚀 Features Implemented

### Backend Services
- **Database Service** (`src/lib/database.ts`): Prisma client configuration with singleton pattern
- **OCR Service** (`src/lib/ocrService.ts`): Complete CRUD operations for OCR responses
  - Create OCR response
  - Get paginated responses
  - Search responses by text content
  - Get individual response
  - Delete response
  - Get statistics

### API Endpoints
- `POST /api/ocr` - Process image and save to database
- `GET /api/ocr-responses` - List responses with pagination
- `GET /api/ocr-responses/search` - Search responses
- `GET /api/ocr-responses/stats` - Get statistics
- `GET /api/ocr-responses/[id]` - Get individual response
- `DELETE /api/ocr-responses/[id]` - Delete response

### React Hooks
- **useOcrResponses**: Manages fetching, pagination, and searching
- **useOcrStats**: Handles statistics fetching
- **useOcrMutation**: Handles create and delete operations

### UI Components
- **OcrResponsesList**: Displays saved responses with search and pagination
- **OcrStats**: Shows statistics dashboard
- **Updated Home Page**: Tabbed interface for upload and history

## 📊 Statistics Tracked
- Total number of responses
- Total characters extracted
- Average processing time
- Most common image format

## 🔍 Search Features
- Full-text search in extracted content
- Case-insensitive search
- Pagination support
- Real-time filtering

## 🎨 UI Features
- Tabbed interface (Upload & Extract / History & Stats)
- Responsive design
- Dark/light mode support
- Loading states and error handling
- Real-time updates after operations

## 🛠️ Error Handling
- Comprehensive error messages
- Retry mechanisms
- Graceful fallbacks
- User-friendly error displays

## 📝 Usage
1. Upload images in the "Upload & Extract" tab
2. View extracted text and saved response ID
3. Switch to "History & Stats" tab to:
   - View all saved responses
   - Search through extracted text
   - See processing statistics
   - Delete unwanted responses

All responses are automatically saved to the database with metadata including processing time, file size, and MIME type for comprehensive tracking and analysis.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const offset = (page - 1) * limit;

    // Get OCR responses with pagination
    const [ocrResponses, total] = await Promise.all([
      prisma.ocrResponse.findMany({
        where: {
          user: {
            email: session.user.email,
          },
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.ocrResponse.count({
        where: {
          user: {
            email: session.user.email,
          },
        },
      }),
    ]);

    // Parse extracted text to create business card-like objects
    const businessCards = ocrResponses.map((response) => {
      const extractedText = response.extractedText;
      const lines = extractedText.split('\n').filter(line => line.trim());
      
      // Simple parsing logic to extract business card info
      let name = '';
      let title = '';
      let company = '';
      let email = '';
      let phone = '';
      
      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Email detection
        if (trimmedLine.includes('@') && !email) {
          email = trimmedLine;
        }
        // Phone detection (simple patterns)
        else if (/[\+\-\(\)\d\s]{10,}/.test(trimmedLine) && (trimmedLine.includes('+') || trimmedLine.includes('(') || trimmedLine.length > 10) && !phone) {
          phone = trimmedLine;
        }
        // First non-empty line is likely the name
        else if (index === 0 && !name) {
          name = trimmedLine;
        }
        // Second line might be title
        else if (index === 1 && !title) {
          title = trimmedLine;
        }
        // Third line might be company
        else if (index === 2 && !company && !trimmedLine.includes('@') && !/[\+\-\(\)\d\s]{10,}/.test(trimmedLine)) {
          company = trimmedLine;
        }
      });

      // Generate avatar from name
      const avatar = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

      return {
        id: response.id,
        name: name || 'Unknown Contact',
        title: title || '',
        company: company || '',
        email: email || '',
        phone: phone || '',
        extractedText: response.extractedText,
        originalName: response.originalName,
        mimeType: response.mimeType,
        imageSize: response.imageSize,
        processingTime: response.processingTime,
        isDemo: response.isDemo,
        avatar,
        createdAt: response.createdAt,
        lastContact: formatTimeAgo(response.createdAt),
        status: 'new', // Default status for extracted cards
      };
    });

    return NextResponse.json({
      cards: businessCards,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching business cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch business cards" },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

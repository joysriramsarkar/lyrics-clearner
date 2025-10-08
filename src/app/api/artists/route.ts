import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const artists = await db.artist.findMany({
      include: {
        songs: {
          select: {
            id: true,
            title: true,
            album: true,
            releaseDate: true,
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, biography, birthDate, genre, country, image } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Artist name is required' },
        { status: 400 }
      );
    }

    const artist = await db.artist.create({
      data: {
        name,
        biography,
        birthDate: birthDate ? new Date(birthDate) : null,
        genre,
        country,
        image,
      },
    });

    return NextResponse.json(artist, { status: 201 });
  } catch (error) {
    console.error('Error creating artist:', error);
    return NextResponse.json(
      { error: 'Failed to create artist' },
      { status: 500 }
    );
  }
}
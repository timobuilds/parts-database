import { NextResponse } from 'next/server';
import { parse } from 'csv-parse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const fileContent = await file.text();
    
    return new Promise((resolve, reject) => {
      parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      }, async (err, records) => {
        if (err) {
          resolve(NextResponse.json(
            { error: 'Error parsing CSV' },
            { status: 400 }
          ));
          return;
        }

        try {
          const parts = await Promise.all(
            records.map(async (record: any) => {
              return await prisma.part.create({
                data: {
                  internalPartNumber: record.internalPartNumber,
                  internalDescription: record.internalDescription,
                  manufacturerName: record.manufacturerName,
                  manufacturerPartNumber: record.manufacturerPartNumber,
                },
              });
            })
          );

          resolve(NextResponse.json(parts));
        } catch (error) {
          console.error('Database error:', error);
          resolve(NextResponse.json(
            { error: 'Error saving to database' },
            { status: 500 }
          ));
        }
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

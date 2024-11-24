import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const updatedPart = await prisma.part.update({
      where: { id },
      data: {
        internalPartNumber: data.internalPartNumber,
        internalDescription: data.internalDescription,
        manufacturerName: data.manufacturerName,
        manufacturerPartNumber: data.manufacturerPartNumber,
      },
    });

    return NextResponse.json(updatedPart);
  } catch (error) {
    console.error('Error updating part:', error);
    return NextResponse.json(
      { error: 'Failed to update part' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.part.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting part:', error);
    return NextResponse.json(
      { error: 'Failed to delete part' },
      { status: 500 }
    );
  }
}

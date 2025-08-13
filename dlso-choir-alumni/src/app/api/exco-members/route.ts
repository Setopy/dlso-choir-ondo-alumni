// src/app/api/exco-members/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAllExcoMembers, getExcoMemberById, updateExcoMember } from '@/lib/exco-db'

// GET - Fetch all EXCO members or single member by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('id')
    
    if (memberId) {
      // Get single member
      const member = await getExcoMemberById(memberId)
      
      if (!member) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 })
      }
      
      return NextResponse.json({ member, success: true })
    } else {
      // Get all members
      const members = await getAllExcoMembers()
      return NextResponse.json({ members, success: true })
    }
    
  } catch (error) {
    console.error('Error fetching EXCO members:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch EXCO members',
      success: false 
    }, { status: 500 })
  }
}

// PUT - Update EXCO member information
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('id')
    
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }
    
    const updateData = await request.json()
    const updatedMember = await updateExcoMember(memberId, updateData)
    
    if (!updatedMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      member: updatedMember, 
      success: true,
      message: 'Member updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating EXCO member:', error)
    return NextResponse.json({ 
      error: 'Failed to update EXCO member',
      success: false 
    }, { status: 500 })
  }
}

// POST - Create new EXCO member (optional for future use)
export async function POST(request: NextRequest) {
  try {
    const memberData = await request.json()
    
    // Basic validation
    if (!memberData.id || !memberData.name || !memberData.role) {
      return NextResponse.json({ 
        error: 'Missing required fields: id, name, role' 
      }, { status: 400 })
    }
    
    const { createExcoMember } = await import('@/lib/exco-db')
    const newMember = await createExcoMember(memberData)
    
    return NextResponse.json({ 
      member: newMember, 
      success: true,
      message: 'Member created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating EXCO member:', error)
    return NextResponse.json({ 
      error: 'Failed to create EXCO member',
      success: false 
    }, { status: 500 })
  }
}

// DELETE - Remove EXCO member (optional for future use)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('id')
    
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }
    
    const { deleteExcoMember } = await import('@/lib/exco-db')
    const deleted = await deleteExcoMember(memberId)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Member deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting EXCO member:', error)
    return NextResponse.json({ 
      error: 'Failed to delete EXCO member',
      success: false 
    }, { status: 500 })
  }
}
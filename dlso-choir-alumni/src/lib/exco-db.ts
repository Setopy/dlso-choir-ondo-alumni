// src/lib/exco-db.ts
import { connectToDatabase } from './mongodb'

export interface IExcoMember {
  id: string
  name: string
  title: string
  role: string
  phone: string
  whatsappLink: string
  bio: string
  detailedBio: string
  currentPositions: string[]
  personalInfo: {
    birthday?: string
    wedding?: string
    bornAgain?: string
    bibleVerse?: string
    maritalStatus?: string
    favoriteColors?: string[]
    favoriteMeal?: string
    hobbies?: string[]
  }
  image?: string
  location: string
  country: string
  ministryFocus: string
  createdAt?: Date
  updatedAt?: Date
}

// Initial EXCO data to seed the database
export const initialExcoMembers: IExcoMember[] = [
  {
    id: "exco_president",
    name: "Elijah Adetimehin", 
    title: "Pastor",
    role: "President",
    phone: "+234 812 931 9690",
    whatsappLink: "https://wa.me/2348129319690",
    bio: "MD of Zircon MFB, CFO of Group of Companies, HR & Tax Consultant, Pastor at RCCG Royal Diadem & Instructor at Kenneth Hagin Rhema Bible Training Centre. On a mission to lay Godly foundation for many generations.",
    detailedBio: "Passionate leader with core values of 'Love God & Value People'. Dedicated to reaching the least, lost and last, with a mission to lay Godly foundation for many generations.",
    currentPositions: [
      "President, DLSO Alumni Ondo",
      "MD, Zircon MFB", 
      "CFO, Group of Companies",
      "HR & Tax Consultant",
      "Pastor, RCCG Royal Diadem",
      "Instructor, Kenneth Hagin Rhema Bible Training Centre"
    ],
    personalInfo: {
      birthday: "October 23",
      wedding: "September 20", 
      bornAgain: "November 27",
      bibleVerse: "Mark 11:23",
      maritalStatus: "Happily Married with 4 Children",
      favoriteColors: ["Black", "Navy Blue", "White", "Red"],
      favoriteMeal: "Anything at the moment"
    },
    location: "Akure",
    country: "Nigeria",
    ministryFocus: "Presidential Leadership & Spiritual Development",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "exco_vp",
    name: "Mojisola Clara Hosu",
    title: "Dr.",
    role: "Vice President", 
    phone: "+27 67 956 7812",
    whatsappLink: "https://wa.me/27679567812",
    bio: "Post-doctoral researcher in medical microbiology, former tax officer in Nigeria. Co-founder of Shepherd House Ministry with her husband, leading our international expansion efforts.",
    detailedBio: "International coordinator and medical researcher with extensive experience in microbiology research. Co-founder of Shepherd House Ministry (Mummy GO), leading our South African alumni chapter.",
    currentPositions: [
      "Vice President, DLSO Alumni Ondo",
      "Post-Doctoral Researcher, Medical Microbiology",
      "Former Tax Officer, Nigeria", 
      "Co-founder, Shepherd House Ministry"
    ],
    personalInfo: {
      maritalStatus: "Married (Mummy GO)"
    },
    location: "Cape Town",
    country: "South Africa", 
    ministryFocus: "International Relations & Medical Ministry",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "exco_gensec",
    name: "Ayokunle Akinsade",
    title: "Dr.",
    role: "General Secretary",
    phone: "+234 806 216 2554",
    whatsappLink: "https://wa.me/2348062162554", 
    bio: "Mental Health Physician practicing in Ido Ekiti, Ekiti State. Ekiti North State DLCF Choir Master and Associate Coordinator. Politically engaged professional.",
    detailedBio: "Dedicated mental health physician providing healthcare guidance and maintaining alumni records. Passionate about political and social development with focus on community advancement.",
    currentPositions: [
      "General Secretary, DLSO Alumni Ondo",
      "Mental Health Physician, Ido Ekiti",
      "Ekiti North State DLCF Choir Master",
      "Associate Coordinator, DLCF",
      "Community Political Activist"
    ],
    personalInfo: {
      maritalStatus: "Married"
    },
    location: "Ido Ekiti",
    country: "Nigeria",
    ministryFocus: "Mental Health & Administrative Coordination",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "exco_program",
    name: "Seyi Ogunji",
    title: "Engr.",
    role: "Program & Publicity Secretary",
    phone: "+526634369566", 
    whatsappLink: "https://wa.me/526634369566",
    bio: "Pioneer Pastor of DCLM in Mexico (Daddy SO). Recently completed MSc with honors. AI researcher and specialist leading our technological advancement and international ministry expansion.",
    detailedBio: "Technology innovator and pioneer pastor in Mexico. AI specialist with MSc honors, driving our digital transformation and international ministry expansion.",
    currentPositions: [
      "Program & Publicity Secretary, DLSO Alumni",
      "Pioneer Pastor, DCLM Mexico (Daddy SO)",
      "AI Research Specialist", 
      "MSc Graduate with Honors",
      "Technology Innovation Lead"
    ],
    personalInfo: {
      maritalStatus: "Married (Daddy SO)"
    },
    location: "Mexico City",
    country: "Mexico",
    ministryFocus: "Technology & Digital Ministry Expansion",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "exco_financial",
    name: "EbunOluwa Samson-Molawa",
    title: "Mrs.",
    role: "Financial Secretary", 
    phone: "+234 803 585 0150",
    whatsappLink: "https://wa.me/2348035850150",
    bio: "Managing Director of Twytas Pharmacy Ltd in Akure and Chemistry Tutor at Adeyemi Federal University Model Secondary School. General Secretary of CASSON Ondo State.",
    detailedBio: "Financial leader and pharmacy entrepreneur with diverse professional and personal dimensions. Specialized in marital counseling with passion for interpersonal relationships and educational leadership.",
    currentPositions: [
      "Financial Secretary, DLSO Alumni Ondo",
      "Managing Director, Twytas Pharmacy Ltd, Akure",
      "Chemistry Tutor, Adeyemi Federal University Model Secondary School",
      "General Secretary, CASSON Ondo State"
    ],
    personalInfo: {
      birthday: "December 17",
      wedding: "March 18",
      bornAgain: "December 26", 
      bibleVerse: "Psalm 91:1",
      maritalStatus: "Happily Married with 3 Children",
      favoriteColors: ["Peach", "Gold", "Lilac", "Grey", "Chocolate"],
      favoriteMeal: "Pounded yam with okro soup",
      hobbies: ["Marital Counselling", "Travelling", "Reading", "Acting", "Photography", "Dancing"]
    },
    location: "Akure", 
    country: "Nigeria",
    ministryFocus: "Financial Management & Marital Counseling",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "exco_prayer",
    name: "Jumoke Owoeye",
    title: "Sis.",
    role: "Prayer & Welfare Secretary",
    phone: "+234 803 679 8012",
    whatsappLink: "https://wa.me/2348036798012",
    bio: "Dedicated prayer warrior and welfare coordinator. Leading our prayer initiatives and coordinating welfare support for alumni in need.",
    detailedBio: "Committed to the spiritual wellbeing and practical support of our alumni community. Passionate about maintaining spiritual unity across our global network through prayer and welfare coordination.",
    currentPositions: [
      "Prayer & Welfare Secretary, DLSO Alumni",
      "Prayer Initiatives Coordinator",
      "Alumni Welfare Support Lead"
    ],
    personalInfo: {
      maritalStatus: "Married"
    },
    location: "Lagos",
    country: "Nigeria", 
    ministryFocus: "Prayer Ministry & Alumni Welfare",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

/**
 * Get all EXCO members from database
 */
export async function getAllExcoMembers(): Promise<IExcoMember[]> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('exco_members')
    
    // Check if collection is empty and seed with initial data
    const count = await collection.countDocuments()
    if (count === 0) {
      console.log('Seeding EXCO members database...')
      await collection.insertMany(initialExcoMembers)
    }
    
    const members = await collection.find({}).sort({ role: 1 }).toArray()
    
    // Remove MongoDB _id from response and ensure proper typing
    return members.map(member => {
      const { _id, ...memberData } = member
      return memberData as IExcoMember
    })
  } catch (error) {
    console.error('Error fetching EXCO members:', error)
    throw new Error('Failed to fetch EXCO members')
  }
}

/**
 * Get a single EXCO member by ID
 */
export async function getExcoMemberById(memberId: string): Promise<IExcoMember | null> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('exco_members')
    
    const member = await collection.findOne({ id: memberId })
    
    if (!member) return null
    
    const { _id, ...memberData } = member
    return memberData as IExcoMember
  } catch (error) {
    console.error('Error fetching EXCO member:', error)
    throw new Error('Failed to fetch EXCO member')
  }
}

/**
 * Update EXCO member photo URL - FIXED NULL HANDLING
 */
export async function updateExcoMemberPhoto(memberId: string, imageUrl: string): Promise<IExcoMember | null> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('exco_members')
    
    const result = await collection.findOneAndUpdate(
      { id: memberId },
      { 
        $set: {
          image: imageUrl,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    
    // FIX: Check if result.value exists
    if (!result || !result.value) {
      throw new Error(`EXCO member with ID ${memberId} not found`)
    }
    
    const { _id: _, ...memberData } = result.value
    return memberData as IExcoMember
  } catch (error) {
    console.error('Error updating EXCO member photo:', error)
    throw new Error('Failed to update EXCO member photo')
  }
}

/**
 * Update EXCO member information - FIXED NULL HANDLING
 */
export async function updateExcoMember(memberId: string, updateData: Partial<IExcoMember>): Promise<IExcoMember | null> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('exco_members')
    
    const result = await collection.findOneAndUpdate(
      { id: memberId },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    
    // FIX: Check if result.value exists
    if (!result || !result.value) {
      throw new Error(`EXCO member with ID ${memberId} not found`)
    }
    
    const { _id, ...memberData } = result.value
    return memberData as IExcoMember
  } catch (error) {
    console.error('Error updating EXCO member:', error)
    throw new Error('Failed to update EXCO member')
  }
}

/**
 * Create a new EXCO member
 */
export async function createExcoMember(memberData: IExcoMember): Promise<IExcoMember> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('exco_members')
    
    const memberWithTimestamps = {
      ...memberData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await collection.insertOne(memberWithTimestamps)
    
    if (!result.insertedId) {
      throw new Error('Failed to create EXCO member')
    }
    
    return memberWithTimestamps
  } catch (error) {
    console.error('Error creating EXCO member:', error)
    throw new Error('Failed to create EXCO member')
  }
}

/**
 * Delete an EXCO member
 */
export async function deleteExcoMember(memberId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('exco_members')
    
    const result = await collection.deleteOne({ id: memberId })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting EXCO member:', error)
    throw new Error('Failed to delete EXCO member')
  }
}

/**
 * Initialize/seed the EXCO members collection
 */
export async function seedExcoMembers(): Promise<void> {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('exco_members')
    
    // Clear existing data
    await collection.deleteMany({})
    
    // Insert initial data
    await collection.insertMany(initialExcoMembers)
    
    console.log('EXCO members database seeded successfully')
  } catch (error) {
    console.error('Error seeding EXCO members:', error)
    throw new Error('Failed to seed EXCO members')
  }
}

/**
 * Get EXCO statistics
 */
export async function getExcoStats() {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('exco_members')
    
    const totalMembers = await collection.countDocuments()
    const membersByCountry = await collection.distinct('country')
    const membersWithPhotos = await collection.countDocuments({ image: { $exists: true, $ne: null } })
    
    return {
      totalMembers,
      countries: membersByCountry.length,
      membersWithPhotos,
      photoCompletionRate: totalMembers > 0 ? Math.round((membersWithPhotos / totalMembers) * 100) : 0
    }
  } catch (error) {
    console.error('Error fetching EXCO stats:', error)
    throw new Error('Failed to fetch EXCO stats')
  }
}
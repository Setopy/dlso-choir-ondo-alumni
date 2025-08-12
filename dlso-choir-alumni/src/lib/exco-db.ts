// src/lib/exco-db.ts - FINAL VERSION: Keeps your structure + synchronized data
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

// UPDATED: Synchronized EXCO data to match your requirements
export const initialExcoMembers: IExcoMember[] = [
  {
    id: "exco_president",
    name: "Elijah Adetimehin", 
    title: "Pastor",
    role: "President",
    phone: "+234 812 931 9690",
    whatsappLink: "https://wa.me/2348129319690",
    bio: "I love God & Value People. I am on a mission to laying Godly foundation for many generations. Reaching the least, lost & last. I love reading & counseling.",
    detailedBio: "President of DLSO Alumni Ondo, MD Zircon MFB, CFO of Group of Companies, HR & Tax Consultant, Pastor at RCCG Royal Diadem & Instructor at Kenneth Hagin Rhema Bible Training Centre-Nigeria. Passionate leader with core values of 'Love God & Value People'. Dedicated to reaching the least, lost and last, with a mission to laying Godly foundation for many generations.",
    currentPositions: [
      "President, DLSO Alumni Ondo",
      "MD, Zircon MFB", 
      "CFO, Group of Companies",
      "HR & Tax Consultant",
      "Pastor, RCCG Royal Diadem",
      "Instructor, Kenneth Hagin Rhema Bible Training Centre-Nigeria"
    ],
    personalInfo: {
      birthday: "October 23",
      wedding: "September 20", 
      bornAgain: "November 27",
      bibleVerse: "Mark 11:23",
      maritalStatus: "Happily Married with 4 Children",
      favoriteColors: ["Black", "Navy Blue", "White", "Red"],
      favoriteMeal: "Anything at the moment",
      hobbies: ["Reading", "Counseling", "Teaching", "Community Service"]
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
    location: "South Africa",
    country: "South Africa", 
    ministryFocus: "International Relations & Medical Ministry",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "exco_gensec",
    name: "Ayokunle Felix AKINSADE",
    title: "Dr.",
    role: "General Secretary",
    phone: "+234 806 216 2554",
    whatsappLink: "https://wa.me/2348062162554", 
    bio: "I Love and enjoy my family love. I love to share my faith, the gospel of Christ with people around me. I believe in practical christianity and believers vying for leadership positions. As an enthusiastic Mental Health Physician, counselling and psychoeducation is my 2nd nature.",
    detailedBio: "General Secretary of DLSO Alumni Ondo, DLCF Associate Coordinator and DLCF State Choir Master for Ekiti North State, Mental Health Physician at Federal Teaching Hospital Ido-Ekiti (FETHI), Chief Resident of the Department of Mental Health FETHI, and Manager of Shadel Business World International. Passionate about family, sharing the gospel as the power of God unto salvation, practical Christianity, political leadership for moral sustenance, mental health counseling, and legitimate business ventures. Believes strongly that believers are a main component of hope for sustenance of morality and integrity in society.",
    currentPositions: [
      "General Secretary, DLSO Alumni Ondo",
      "DLCF Associate Coordinator, Ekiti North State",
      "DLCF State Choir Master, Ekiti North State", 
      "Mental Health Physician, Federal Teaching Hospital Ido-Ekiti (FETHI)",
      "Chief Resident, Department of Mental Health, FETHI",
      "Manager, Shadel Business World International"
    ],
    personalInfo: {
      birthday: "June 7",
      wedding: "August 10",
      bibleVerse: "Philippians 1:6, Matthew 5:13-16:17",
      maritalStatus: "Happily Married with 3 lovely girls",
      favoriteColors: ["Blue", "White"],
      favoriteMeal: "Semo/Wheat with vegetables soup, jollof and fried rice with cream and vegetable salad",
      hobbies: ["Family time", "Sharing the gospel", "Mental health counseling", "Business ventures", "Classical music", "Contemporary music", "Traditional music", "Political engagement"]
    },
    location: "Ido Ekiti",
    country: "Nigeria",
    ministryFocus: "Mental Health & Administrative Coordination",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "exco_financial",
    name: "Ebunoluwa Prosper Samson-Molawa",
    title: "Mrs.",
    role: "Financial Secretary", 
    phone: "+234 803 585 0150",
    whatsappLink: "https://wa.me/2348035850150",
    bio: "I love God, I love to praise and worship Him. I admire and value interpersonal relationships. I love Counselling but I focus more on Marital Counselling.",
    detailedBio: "Financial Secretary of DLSO Alumni Ondo, Managing Director of Twytas Pharmacy Ltd., Akure, Chemistry Tutor at Adeyemi Federal University of Education Model Secondary School, Akure & General Secretary of Counselling Association of Nigeria (CASSON), Ondo State Chapter. Passionate about God, worship, interpersonal relationships, and specialized in marital counselling.",
    currentPositions: [
      "Financial Secretary, DLSO Alumni Ondo",
      "Managing Director, Twytas Pharmacy Ltd., Akure",
      "Chemistry Tutor, Adeyemi Federal University of Education Model Secondary School, Akure",
      "General Secretary, Counselling Association of Nigeria (CASSON), Ondo State Chapter"
    ],
    personalInfo: {
      birthday: "December 17",
      wedding: "March 18",
      bornAgain: "December 26", 
      bibleVerse: "Psalm 91:1",
      maritalStatus: "Happily Married with 3 Children",
      favoriteColors: ["Peach", "Gold", "Lilac", "Grey", "Chocolate"],
      favoriteMeal: "Pounded yam and okro soup",
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
    name: "Olugbenga-OWOEYE Adejumoke",
    title: "Sis.",
    role: "Prayer & Welfare Secretary",
    phone: "+234 803 679 8012",
    whatsappLink: "https://wa.me/2348036798012",
    bio: "I Love impacting lives, especially youths, spreading the knowledge of God and identity of sons. I love good music, Influencing people at any God given opportunity.",
    detailedBio: "Prayer & Welfare Secretary of DLSO Alumni Ondo, DLSO Worker at DLBC, Women Coordinator at DLBC Ekiti, Manager of Shekinah varieties, and Nurse at Federal Teaching Hospital Ekiti. Passionate about impacting lives, especially youth ministry, spreading the knowledge of God and identity of sons.",
    currentPositions: [
      "Prayer & Welfare Secretary, DLSO Alumni Ondo",
      "DLSO Worker, DLBC",
      "Women Coordinator, DLBC Ekiti", 
      "Manager, Shekinah varieties",
      "Nurse, Federal Teaching Hospital Ekiti"
    ],
    personalInfo: {
      birthday: "May 2",
      wedding: "March 1",
      bornAgain: "August 6",
      bibleVerse: "Ephesians 5:30, 1 John 4:17",
      maritalStatus: "Favorably Married with 2 Children",
      favoriteColors: ["Pink", "Purple"],
      favoriteMeal: "Fried rice with creamed vegetable salad",
      hobbies: ["Impacting lives", "Youth ministry", "Good music", "Influencing people"]
    },
    location: "Ekiti",
    country: "Nigeria", 
    ministryFocus: "Prayer Ministry & Alumni Welfare",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "exco_program",
    name: "Seyi Tope Ogunji",
    title: "Engr.",
    role: "Program & Publicity Secretary",
    phone: "+526634369566", 
    whatsappLink: "https://wa.me/526634369566",
    bio: "Adept believer in Scripture-based family life. I strongly believe IMPOSSIBLE IS NOTHING and strive for mastery. I shamelessly believe in the infallibility of the scriptures and strictly regulate my life with its tenets. I value evangelism, humility, proactivity and growth mindset.",
    detailedBio: "Program & Publicity Coordinator of DLSO Alumni Ondo, Founding Pastor of Deeper Life Bible Church Baja California Mexico (God-sent Missionary to Mexico), International published Author (Springer Nature and Scopus-indexed), Fully-funded PhD student in Quantum Cryptography & Artificial Intelligence at Instituto Politecnico Nacional (IPN) Mexico, MSc in Digital systems (Artificial Intelligence & Cryptography) with Cum Laude award (The first black recipient at the centre), and Founder of ELITAZIT International Digital School Mexico. Passionate about Scripture-based living, believing impossible is nothing, evangelism, and technological advancement in ministry.",
    currentPositions: [
      "Program & Publicity Coordinator, DLSO Alumni Ondo",
      "Founding Pastor, Deeper Life Bible Church, Baja California, Mexico",
      "God-sent Missionary to Mexico",
      "International published Author (Springer Nature and Scopus-indexed)",
      "Fully-funded PhD student (Quantum Cryptography & AI), Instituto Politecnico Nacional, Mexico",
      "MSc Digital systems (AI & Cryptography) with Cum Laude award",
      "Founder, ELITAZIT International Digital School, Mexico"
    ],
    personalInfo: {
      birthday: "December 17",
      wedding: "September 12",
      bornAgain: "January 11",
      bibleVerse: "Isaiah 40:3, Hebrews 12:14, 1 Timothy 3:16",
      maritalStatus: "Happily Married with 4 lovely kids (a set of twins inclusive)",
      favoriteColors: ["Blue", "Green"],
      favoriteMeal: "Mashed beans, and egusi and vegetable accompanied with regular swallow",
      hobbies: ["Evangelism", "Scripture study", "Research", "Technology innovation", "Music", "Teaching", "Writing", "Family time"]
    },
    location: "Mexico City",
    country: "Mexico",
    ministryFocus: "Technology & Digital Ministry Expansion",
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
    
    // Define role hierarchy for proper sorting
    const roleHierarchy = {
      'President': 1,
      'Vice President': 2,
      'General Secretary': 3,
      'Financial Secretary': 4,
      'Program & Publicity Secretary': 5,
      'Prayer & Welfare Secretary': 6
    }
    
    const members = await collection.find({}).toArray()
    
    // Sort members by role hierarchy, then by name
    const sortedMembers = members.sort((a, b) => {
      const roleOrderA = roleHierarchy[a.role as keyof typeof roleHierarchy] || 99
      const roleOrderB = roleHierarchy[b.role as keyof typeof roleHierarchy] || 99
      
      if (roleOrderA !== roleOrderB) {
        return roleOrderA - roleOrderB
      }
      return a.name.localeCompare(b.name)
    })
    
    // Remove MongoDB _id from response and ensure proper typing
    return sortedMembers.map(member => {
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
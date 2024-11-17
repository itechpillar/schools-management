import AppDataSource from "../config/database";
import { School } from "../models/School";

const schools = [
  {
    name: "Springfield Elementary School",
    address: "123 School St, Springfield, ST 12345",
    contactNumber: "555-0101",
    email: "info@springfield.edu"
  },
  {
    name: "Riverside High School",
    address: "456 River Rd, Riverside, ST 12346",
    contactNumber: "555-0102",
    email: "info@riverside.edu"
  },
  {
    name: "Mountain View Academy",
    address: "789 Mountain Ave, Mountain View, ST 12347",
    contactNumber: "555-0103",
    email: "info@mountainview.edu"
  },
  {
    name: "Lakeside Preparatory School",
    address: "321 Lake Dr, Lakeside, ST 12348",
    contactNumber: "555-0104",
    email: "info@lakesideprep.edu"
  },
  {
    name: "Valley Middle School",
    address: "654 Valley Blvd, Valley City, ST 12349",
    contactNumber: "555-0105",
    email: "info@valleyms.edu"
  }
];

async function seedSchools() {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    const schoolRepository = AppDataSource.getRepository(School);

    // Delete existing schools
    await schoolRepository.delete({});
    console.log("Cleared existing schools");

    // Create and save schools
    for (const schoolData of schools) {
      const school = new School();
      Object.assign(school, schoolData);
      await schoolRepository.save(school);
      console.log(`Created school: ${school.name}`);
    }

    console.log("Schools seeding completed successfully");
  } catch (error) {
    console.error("Error seeding schools:", error);
  } finally {
    // Close the database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Database connection closed");
    }
  }
}

// Run the seed function
seedSchools();

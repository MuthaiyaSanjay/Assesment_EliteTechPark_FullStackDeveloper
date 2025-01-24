const Role = require("../models/role");

const seedRoles = async () => {
  try {
    const roles = ["vendor", "buyer", "admin","staff"];

    const existingRoles = await Role.find();
    if (existingRoles.length > 0) {
      console.log("Roles already exist. Skipping seeding.");
      return;
    }

    const roleData = roles.map((role) => ({ name: role }));
    await Role.insertMany(roleData);
    console.log("Roles seeded successfully:", roles);
  } catch (error) {
    console.error("Error seeding roles:", error.message);
  }
};

module.exports = seedRoles;

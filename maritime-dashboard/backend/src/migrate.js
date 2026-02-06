const mongoose = require('mongoose');
const Organization = require('./models/organization.model');
const User = require('./models/user.model');
const Vessel = require('./models/vessel.model');
const Crew = require('./models/crew.model');
const Report = require('./models/report.model');

async function migrateToSaaS() {
  try {
    console.log('🚀 Starting SaaS Migration...');
    
    // 1. Create Default Organization
    let defaultOrg = await Organization.findOne({ slug: 'default' });
    if (!defaultOrg) {
      defaultOrg = await Organization.create({
        name: 'Default Organization',
        slug: 'default',
        plan: 'enterprise'
      });
      console.log('✅ Created Default Organization');
    }

    // 2. Assign orgId to all Users who don't have one
    const userResult = await User.updateMany(
      { orgId: { $exists: false } },
      { $set: { orgId: defaultOrg._id } }
    );
    console.log(`✅ Updated ${userResult.modifiedCount} Users with orgId`);

    // 3. Assign orgId to all Vessels
    const vesselResult = await Vessel.updateMany(
      { orgId: { $exists: false } },
      { $set: { orgId: defaultOrg._id } }
    );
    console.log(`✅ Updated ${vesselResult.modifiedCount} Vessels with orgId`);

    // 4. Assign orgId to all Crew
    const crewResult = await Crew.updateMany(
      { orgId: { $exists: false } },
      { $set: { orgId: defaultOrg._id } }
    );
    console.log(`✅ Updated ${crewResult.modifiedCount} Crew with orgId`);

    // 5. Assign orgId to all Reports
    const reportResult = await Report.updateMany(
      { orgId: { $exists: false } },
      { $set: { orgId: defaultOrg._id } }
    );
    console.log(`✅ Updated ${reportResult.modifiedCount} Reports with orgId`);

    console.log('🏁 SaaS Migration Completed Successfully!');
  } catch (err) {
    console.error('❌ Migration Error:', err.message);
  }
}

module.exports = migrateToSaaS;

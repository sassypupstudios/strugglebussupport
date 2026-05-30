// Pet care resources added 2026-05-25.
// Directory-only entries: service type, contact info, and call-ahead guidance. No pricing listed.

if (Array.isArray(CATEGORIES) && !CATEGORIES.some((category) => category.id === 'pet-care')) {
  CATEGORIES.push({ id: 'pet-care', label: 'Pet Care Help', icon: '🐾' });
}

if (Array.isArray(RESOURCES)) {
  const petCareResources = [
    {
      id: 'animal-allies-spay-neuter-clinic',
      name: 'Animal Allies Spay & Neuter Clinic',
      category: 'pet-care',
      address: '820 Gossett Road, Spartanburg, SC 29307',
      zip: '29307',
      phone: '(864) 576-6971',
      hours: 'Tue–Fri 7:30 AM – 4:30 PM · Closed Sat–Mon',
      eligibility: 'Serves Upstate SC and surrounding areas. Call or email for appointment requirements.',
      description: 'Low-cost spay/neuter clinic offering spay and neuter services, vaccinations at the time of surgery, and minor services through a vaccine clinic for already altered animals. For appointments, call or email animalalliesappointments@yahoo.com.',
      website: 'https://animalalliesclinic.org',
      mapsUrl: 'https://maps.google.com/?q=820+Gossett+Road+Spartanburg+SC+29307',
    },
    {
      id: 'spartanburg-humane-society-veterinary-clinic',
      name: 'Spartanburg Humane Society Veterinary Clinic',
      category: 'pet-care',
      address: '150 Dexter Road, Spartanburg, SC 29303',
      zip: '29303',
      phone: '(864) 583-4805 ext. 115',
      hours: 'Call for current clinic hours. Vaccine and microchip clinic information is listed on the Humane Society site.',
      eligibility: 'Spartanburg-area pet owners. Call ahead to confirm availability and requirements.',
      description: 'Affordable veterinary services and community programs to help pet owners keep pets at home. Also lists vaccine clinic and microchip information. Call the veterinary clinic extension before visiting.',
      website: 'https://spartanburghumane.org',
      mapsUrl: 'https://maps.google.com/?q=150+Dexter+Road+Spartanburg+SC+29303',
    },
    {
      id: 'spartanburg-humane-society-lost-found-receiving',
      name: 'Spartanburg Humane Society Lost & Found / Receiving',
      category: 'pet-care',
      address: '150 Dexter Road, Spartanburg, SC 29303',
      zip: '29303',
      phone: '(864) 583-4805 ext. 116',
      hours: 'Lost & Found / Receiving: Mon–Sat 12:00 PM – 6:00 PM',
      eligibility: 'Pet owners in the Spartanburg area. City/county rules may vary for stray animals.',
      description: 'Helps with lost and found pets, receiving/surrender questions, and rehoming guidance. Call ahead; some services may require a waiting list or referral.',
      website: 'https://spartanburghumane.org/service/',
      mapsUrl: 'https://maps.google.com/?q=150+Dexter+Road+Spartanburg+SC+29303',
    },
    {
      id: 'greenville-county-animal-care-vet-clinic',
      name: 'Greenville County Animal Care Veterinary Clinic',
      category: 'pet-care',
      address: '328 Furman Hall Road, Greenville, SC 29609',
      zip: '29609',
      phone: '(864) 467-3988',
      hours: 'Limited services by appointment. Call to confirm eligibility and schedule.',
      eligibility: 'Qualified low-income Greenville County pet owners. Spartanburg County residents should call to confirm what services are available.',
      description: 'Affordable veterinary care clinic offering pet exams, vaccinations, microchips, deworming, heartworm testing, FELV/FIV testing, and related basic care services for eligible pet owners.',
      website: 'https://www.greenvillecounty.org/ACS/VeterinaryCare.aspx',
      mapsUrl: 'https://maps.google.com/?q=328+Furman+Hall+Road+Greenville+SC+29609',
    },
    {
      id: 'greenville-county-animal-care-food-pantry',
      name: 'Greenville County Animal Care No Empty Bowls Pet Food Pantry',
      category: 'pet-care',
      address: '328 Furman Hall Road, Greenville, SC 29609',
      zip: '29609',
      phone: '(864) 467-3951',
      hours: 'Wed 9:00 AM – 11:00 AM · Tue 2:00 PM – 5:00 PM · Sat 12:00 PM – 2:00 PM',
      eligibility: 'Temporary support for dog and cat food. Supplies are limited and based on availability and need.',
      description: 'Pet food pantry intended to help families keep their pets during difficult times by providing short-term dog and cat food assistance. No appointment needed during scheduled pantry hours.',
      website: 'https://www.greenvillecounty.org/ACS/FoodPantry.aspx',
      mapsUrl: 'https://maps.google.com/?q=328+Furman+Hall+Road+Greenville+SC+29609',
    },
  ];

  const existingResourceIds = new Set(RESOURCES.map((resource) => resource.id));

  for (const resource of petCareResources) {
    if (!existingResourceIds.has(resource.id)) {
      RESOURCES.push(resource);
    }
  }
}

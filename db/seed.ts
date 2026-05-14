import { getDb } from "../api/queries/connection";
import {
  products,
  campaigns,
  orders,
  shippingProviders,
  shipments,
  financialTransactions,
  teamMembers,
  agentActivities,
  kpiMetrics,
  creatives,
  landingPages,
  recommendations,
  whatsappTemplates,
} from "./schema";

async function seed() {
  const db = getDb();

  await db.delete(recommendations);
  await db.delete(landingPages);
  await db.delete(creatives);
  await db.delete(kpiMetrics);
  await db.delete(agentActivities);
  await db.delete(teamMembers);
  await db.delete(financialTransactions);
  await db.delete(shipments);
  await db.delete(orders);
  await db.delete(campaigns);
  await db.delete(shippingProviders);
  await db.delete(products);

  const productData = [
    { name: "3-in-1 Wireless Charger Stand", description: "Charge iPhone, AirPods & Apple Watch simultaneously", sourcePrice: "45.00", suggestedPrice: "225.00", category: "Electronics", saturationScore: 2, competitionScore: 4, demandScore: 8, marketFitScore: 92, marginMultiplier: "5.0", status: "winning" as const, roas: "4.1", unitsSold: 342, revenue: "76950.00", profit: "61560.00" },
    { name: "UV Phone Sanitizer Box", description: "Kills 99.9% of bacteria in 5 minutes", sourcePrice: "18.00", suggestedPrice: "99.00", category: "Health", saturationScore: 3, competitionScore: 3, demandScore: 9, marketFitScore: 88, marginMultiplier: "5.5", status: "scaling" as const, roas: "3.8", unitsSold: 189, revenue: "18711.00", profit: "15309.00" },
    { name: "Smart LED Strip Lights 5M", description: "RGB LED strip with app control, music sync", sourcePrice: "12.00", suggestedPrice: "75.00", category: "Home", saturationScore: 6, competitionScore: 7, demandScore: 6, marketFitScore: 65, marginMultiplier: "6.3", status: "testing" as const, roas: "2.4", unitsSold: 78, revenue: "5850.00", profit: "4914.00" },
    { name: "Foldable Laptop Stand Aluminum", description: "Ergonomic adjustable laptop stand", sourcePrice: "22.00", suggestedPrice: "125.00", category: "Electronics", saturationScore: 4, competitionScore: 5, demandScore: 7, marketFitScore: 78, marginMultiplier: "5.7", status: "scaling" as const, roas: "3.2", unitsSold: 156, revenue: "19500.00", profit: "16068.00" },
    { name: "Portable Blender USB-C", description: "Blend smoothies anywhere, rechargeable", sourcePrice: "15.00", suggestedPrice: "89.00", category: "Health", saturationScore: 3, competitionScore: 4, demandScore: 8, marketFitScore: 85, marginMultiplier: "5.9", status: "winning" as const, roas: "4.5", unitsSold: 267, revenue: "23763.00", profit: "19758.00" },
    { name: "Magnetic Cable Organizer", description: "Keep cables tidy with magnetic clips", sourcePrice: "5.00", suggestedPrice: "35.00", category: "Accessories", saturationScore: 2, competitionScore: 2, demandScore: 7, marketFitScore: 90, marginMultiplier: "7.0", status: "scaling" as const, roas: "3.6", unitsSold: 423, revenue: "14805.00", profit: "12690.00" },
    { name: "Car Phone Holder Gravity", description: "Auto-lock gravity car mount", sourcePrice: "6.00", suggestedPrice: "45.00", category: "Accessories", saturationScore: 7, competitionScore: 8, demandScore: 5, marketFitScore: 55, marginMultiplier: "7.5", status: "dead" as const, roas: "1.2", unitsSold: 34, revenue: "1530.00", profit: "1326.00" },
    { name: "LED Makeup Mirror", description: "Touch dimmable vanity mirror with lights", sourcePrice: "28.00", suggestedPrice: "159.00", category: "Beauty", saturationScore: 4, competitionScore: 5, demandScore: 8, marketFitScore: 82, marginMultiplier: "5.7", status: "winning" as const, roas: "3.9", unitsSold: 198, revenue: "31482.00", profit: "25938.00" },
    { name: "Posture Corrector Belt", description: "Adjustable posture support for back pain", sourcePrice: "8.00", suggestedPrice: "55.00", category: "Health", saturationScore: 5, competitionScore: 6, demandScore: 7, marketFitScore: 72, marginMultiplier: "6.9", status: "testing" as const, roas: "2.8", unitsSold: 89, revenue: "4895.00", profit: "4183.00" },
    { name: "Wireless Gaming Mouse", description: "RGB gaming mouse with 7 programmable buttons", sourcePrice: "16.00", suggestedPrice: "95.00", category: "Electronics", saturationScore: 5, competitionScore: 6, demandScore: 6, marketFitScore: 70, marginMultiplier: "5.9", status: "testing" as const, roas: "2.6", unitsSold: 112, revenue: "10640.00", profit: "8848.00" },
    { name: "Kitchen Oil Spray Bottle", description: "Olive oil sprayer for cooking", sourcePrice: "4.50", suggestedPrice: "29.00", category: "Home", saturationScore: 2, competitionScore: 3, demandScore: 9, marketFitScore: 93, marginMultiplier: "6.4", status: "winning" as const, roas: "4.2", unitsSold: 512, revenue: "14848.00", profit: "12544.00" },
    { name: "Bluetooth 5.3 Earbuds", description: "True wireless earbuds with 30h battery", sourcePrice: "25.00", suggestedPrice: "149.00", category: "Electronics", saturationScore: 8, competitionScore: 9, demandScore: 4, marketFitScore: 45, marginMultiplier: "6.0", status: "dead" as const, roas: "1.1", unitsSold: 23, revenue: "3427.00", profit: "2852.00" },
    { name: "Silicone Baking Mat Set", description: "Non-stick reusable baking mats", sourcePrice: "7.00", suggestedPrice: "42.00", category: "Home", saturationScore: 3, competitionScore: 3, demandScore: 7, marketFitScore: 86, marginMultiplier: "6.0", status: "scaling" as const, roas: "3.4", unitsSold: 178, revenue: "7476.00", profit: "6232.00" },
    { name: "Phone Camera Lens Kit", description: "3-in-1 clip-on lens for smartphones", sourcePrice: "11.00", suggestedPrice: "69.00", category: "Accessories", saturationScore: 4, competitionScore: 5, demandScore: 6, marketFitScore: 68, marginMultiplier: "6.3", status: "testing" as const, roas: "2.2", unitsSold: 67, revenue: "4623.00", profit: "3886.00" },
    { name: "Heated Eye Massager", description: "USB heated eye mask for relaxation", sourcePrice: "14.00", suggestedPrice: "85.00", category: "Health", saturationScore: 3, competitionScore: 3, demandScore: 8, marketFitScore: 87, marginMultiplier: "6.1", status: "winning" as const, roas: "4.0", unitsSold: 234, revenue: "19890.00", profit: "16614.00" },
    { name: "Magnetic Phone Car Mount", description: "MagSafe compatible car holder", sourcePrice: "9.00", suggestedPrice: "59.00", category: "Accessories", saturationScore: 5, competitionScore: 6, demandScore: 6, marketFitScore: 71, marginMultiplier: "6.6", status: "testing" as const, roas: "2.5", unitsSold: 98, revenue: "5782.00", profit: "4900.00" },
    { name: "Reusable Silicone Food Bags", description: "Eco-friendly food storage bags set", sourcePrice: "8.00", suggestedPrice: "49.00", category: "Home", saturationScore: 2, competitionScore: 2, demandScore: 7, marketFitScore: 89, marginMultiplier: "6.1", status: "scaling" as const, roas: "3.5", unitsSold: 145, revenue: "7105.00", profit: "5945.00" },
    { name: "Neck Massager with Heat", description: "Shiatsu neck and shoulder massager", sourcePrice: "32.00", suggestedPrice: "189.00", category: "Health", saturationScore: 5, competitionScore: 6, demandScore: 7, marketFitScore: 74, marginMultiplier: "5.9", status: "scaling" as const, roas: "3.1", unitsSold: 134, revenue: "25326.00", profit: "21038.00" },
    { name: "Smart Water Bottle", description: "LED temperature display, reminder to drink", sourcePrice: "10.00", suggestedPrice: "65.00", category: "Health", saturationScore: 3, competitionScore: 4, demandScore: 7, marketFitScore: 83, marginMultiplier: "6.5", status: "winning" as const, roas: "3.8", unitsSold: 289, revenue: "18785.00", profit: "15895.00" },
    { name: "Mini Projector 1080p", description: "Portable projector for home cinema", sourcePrice: "55.00", suggestedPrice: "299.00", category: "Electronics", saturationScore: 6, competitionScore: 7, demandScore: 5, marketFitScore: 62, marginMultiplier: "5.4", status: "testing" as const, roas: "2.1", unitsSold: 45, revenue: "13455.00", profit: "10980.00" },
  ];
  await db.insert(products).values(productData);
  console.log("Seeded 20 products");

  const providerData = [
    { name: "Bosta", deliveryRate: "92.10", avgDeliveryTime: "2.3", returnRate: "8.5", costPerShipment: "28.00", activeShipments: 340 },
    { name: "Aramex", deliveryRate: "89.40", avgDeliveryTime: "3.1", returnRate: "10.2", costPerShipment: "32.00", activeShipments: 285 },
    { name: "VHub", deliveryRate: "85.70", avgDeliveryTime: "2.8", returnRate: "11.8", costPerShipment: "24.00", activeShipments: 198 },
    { name: "Mylerz", deliveryRate: "91.20", avgDeliveryTime: "2.5", returnRate: "9.1", costPerShipment: "30.00", activeShipments: 267 },
  ];
  await db.insert(shippingProviders).values(providerData);
  console.log("Seeded 4 shipping providers");

  const campaignData = [
    { name: "Summer_Sale_Cairo", productId: 1, objective: "conversion" as const, platform: "facebook", budget: "500.00", spent: "4200.00", roas: "4.1", cpa: "78.00", impressions: 125000, clicks: 3200, conversions: 54, status: "active" as const, startDate: "2025-04-01" },
    { name: "Spring_Health_Launch", productId: 2, objective: "conversion" as const, platform: "instagram", budget: "400.00", spent: "2800.00", roas: "3.8", cpa: "82.00", impressions: 98000, clicks: 2100, conversions: 34, status: "active" as const, startDate: "2025-04-05" },
    { name: "LED_Lights_Giza", productId: 3, objective: "awareness" as const, platform: "tiktok", budget: "300.00", spent: "1500.00", roas: "2.4", cpa: "115.00", impressions: 210000, clicks: 8500, conversions: 13, status: "paused" as const, startDate: "2025-03-15" },
    { name: "Laptop_Stand_Alex", productId: 4, objective: "conversion" as const, platform: "facebook", budget: "350.00", spent: "3100.00", roas: "3.2", cpa: "89.00", impressions: 87000, clicks: 1950, conversions: 35, status: "active" as const, startDate: "2025-04-10" },
    { name: "Blender_Health", productId: 5, objective: "conversion" as const, platform: "instagram", budget: "450.00", spent: "3800.00", roas: "4.5", cpa: "72.00", impressions: 156000, clicks: 4100, conversions: 53, status: "active" as const, startDate: "2025-04-01" },
    { name: "Cable_Org_All", productId: 6, objective: "conversion" as const, platform: "facebook", budget: "200.00", spent: "1800.00", roas: "3.6", cpa: "45.00", impressions: 67000, clicks: 1800, conversions: 40, status: "active" as const, startDate: "2025-04-12" },
    { name: "Summer_Sale_Alex", productId: 7, objective: "conversion" as const, platform: "google", budget: "250.00", spent: "2200.00", roas: "1.8", cpa: "165.00", impressions: 45000, clicks: 890, conversions: 13, status: "stopped" as const, startDate: "2025-03-20", endDate: "2025-04-01" },
    { name: "Mirror_Beauty", productId: 8, objective: "conversion" as const, platform: "instagram", budget: "380.00", spent: "2900.00", roas: "3.9", cpa: "76.00", impressions: 134000, clicks: 3200, conversions: 38, status: "active" as const, startDate: "2025-04-08" },
    { name: "Posture_Health", productId: 9, objective: "awareness" as const, platform: "facebook", budget: "280.00", spent: "1600.00", roas: "2.8", cpa: "98.00", impressions: 78000, clicks: 1400, conversions: 16, status: "active" as const, startDate: "2025-04-15" },
    { name: "Gaming_Mouse_Mans", productId: 10, objective: "conversion" as const, platform: "tiktok", budget: "320.00", spent: "2100.00", roas: "2.6", cpa: "105.00", impressions: 189000, clicks: 5600, conversions: 20, status: "active" as const, startDate: "2025-04-14" },
    { name: "Oil_Spray_Kitchen", productId: 11, objective: "conversion" as const, platform: "facebook", budget: "180.00", spent: "1200.00", roas: "4.2", cpa: "38.00", impressions: 92000, clicks: 2500, conversions: 32, status: "active" as const, startDate: "2025-04-18" },
    { name: "Earbuds_Scale", productId: 12, objective: "conversion" as const, platform: "google", budget: "400.00", spent: "3500.00", roas: "1.1", cpa: "195.00", impressions: 34000, clicks: 560, conversions: 18, status: "stopped" as const, startDate: "2025-03-10", endDate: "2025-03-25" },
  ];
  await db.insert(campaigns).values(campaignData);
  console.log("Seeded 12 campaigns");

  const governorates = ["Cairo", "Giza", "Alexandria", "Port Said", "Suez", "Mansoura", "Tanta", "Asyut", "Minya", "Sohag", "Qena", "Luxor", "Aswan", "Zagazig", "Ismailia"];
  const firstNames = ["Ahmed", "Mohamed", "Mahmoud", "Ali", "Omar", "Khaled", "Hassan", "Ibrahim", "Mostafa", "Youssef", "Sara", "Fatima", "Aya", "Nour", "Mariam", "Hana", "Salma", "Rana", "Dina", "Laila"];
  const orderStatuses = ["new", "whatsapp_sent", "responded", "confirmed", "voice_confirmed", "shipped", "delivered", "returned", "cancelled"] as const;
  const amounts = [99, 149, 225, 125, 89, 35, 45, 159, 55, 95, 29, 149, 42, 69, 85, 59, 49, 189, 65, 299];
  const riskScores = [5, 15, 25, 8, 45, 78, 12, 3, 65, 88, 22, 7, 55, 92, 30];
  const deliveryProbs = [92, 85, 78, 95, 65, 45, 88, 97, 55, 38, 82, 94, 60, 25, 75];

  const orderData = [];
  for (let i = 0; i < 200; i++) {
    const gov = governorates[i % governorates.length];
    const status = orderStatuses[i % orderStatuses.length];
    const productId = (i % 20) + 1;
    const amt = amounts[productId - 1];
    orderData.push({
      orderNumber: `ORD-2025-${String(i + 1).padStart(4, "0")}`,
      customerName: `${firstNames[i % firstNames.length]} ${["Hassan", "Ibrahim", "Ali", "Mohamed", "Sayed", "Omar", "Mahmoud"][i % 7]}`,
      customerPhone: `01${[0,1,2][i%3]}${String(10000000 + i).slice(0,8)}`,
      governorate: gov,
      city: gov,
      productId,
      quantity: (i % 3) + 1,
      totalAmount: String(amt * ((i % 3) + 1)),
      status,
      confirmationMethod: ["whatsapp", "voice", "manual"][i % 3] as "whatsapp" | "voice" | "manual",
      riskScore: riskScores[i % 15],
      isFake: i % 10 === 7,
      deliveryProbability: deliveryProbs[i % 15],
      shippingProviderId: (i % 4) + 1,
    });
  }
  await db.insert(orders).values(orderData);
  console.log("Seeded 200 orders");

  const shipmentStatuses = ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "returned", "failed"] as const;
  const returnReasons = ["Customer refused", "Wrong address", "Damaged", "Not interested", "Ordered by mistake"];
  const deliveryTimes = [24, 48, 36, 72, 28, 55, 42, 38, 65, 30, 44, 50, 58, 33, 41];

  const shipmentData = [];
  for (let i = 0; i < 150; i++) {
    shipmentData.push({
      orderId: i + 1,
      providerId: (i % 4) + 1,
      trackingNumber: `TRK-${String(100000 + i)}`,
      status: shipmentStatuses[i % shipmentStatuses.length],
      governorate: governorates[i % governorates.length],
      pickupDate: `2025-04-${String((i % 20) + 1).padStart(2, "0")}`,
      deliveryDate: `2025-04-${String((i % 20) + 3).padStart(2, "0")}`,
      deliveryTime: deliveryTimes[i % 15],
      isReturned: i % 10 === 0,
      returnReason: i % 10 === 0 ? returnReasons[i % 5] : null,
      cost: [28, 32, 24, 30][i % 4],
    });
  }
  await db.insert(shipments).values(shipmentData);
  console.log("Seeded 150 shipments");

  const finTypes = ["revenue", "refund", "cogs", "ad_spend", "shipping", "cod_fee", "gateway", "tax"] as const;
  const finAmounts = [1200, -150, -480, -320, -28, -12, -8, -56];
  const financialData = [];
  for (let i = 0; i < 100; i++) {
    const type = finTypes[i % finTypes.length];
    financialData.push({
      type,
      category: type,
      amount: String(Math.round((finAmounts[i % finTypes.length] + Math.random() * 200) * 100) / 100),
      description: `${type} transaction #${i + 1}`,
      orderId: (i % 200) + 1,
      campaignId: (i % 12) + 1,
      date: `2025-04-${String((i % 30) + 1).padStart(2, "0")}`,
    });
  }
  await db.insert(financialTransactions).values(financialData);
  console.log("Seeded 100 financial transactions");

  const teamData = [
    { name: "Amr Khaled", email: "amr@nexusai.com", role: "manager" as const, performanceScore: 92, responseTime: "2.1", confirmationRate: "82.5", ordersHandled: 1456, customerRating: "4.8", weeklyOrders: 45, trend: "3.2", status: "online" as const },
    { name: "Nada Hassan", email: "nada@nexusai.com", role: "team_lead" as const, performanceScore: 88, responseTime: "2.8", confirmationRate: "79.3", ordersHandled: 1234, customerRating: "4.6", weeklyOrders: 38, trend: "2.1", status: "online" as const },
    { name: "Omar Farouk", email: "omar@nexusai.com", role: "confirmation_agent" as const, performanceScore: 87, responseTime: "3.1", confirmationRate: "78.2", ordersHandled: 1120, customerRating: "4.5", weeklyOrders: 34, trend: "2.3", status: "online" as const },
    { name: "Salma Ibrahim", email: "salma@nexusai.com", role: "confirmation_agent" as const, performanceScore: 91, responseTime: "2.4", confirmationRate: "81.0", ordersHandled: 1380, customerRating: "4.7", weeklyOrders: 42, trend: "4.1", status: "online" as const },
    { name: "Karim Mahmoud", email: "karim@nexusai.com", role: "moderator" as const, performanceScore: 78, responseTime: "4.5", confirmationRate: "71.5", ordersHandled: 890, customerRating: "4.2", weeklyOrders: 28, trend: "-1.2", status: "away" as const },
    { name: "Yasmin Ali", email: "yasmin@nexusai.com", role: "confirmation_agent" as const, performanceScore: 85, responseTime: "3.5", confirmationRate: "76.8", ordersHandled: 1050, customerRating: "4.4", weeklyOrders: 32, trend: "1.8", status: "online" as const },
    { name: "Mostafa Sayed", email: "mostafa@nexusai.com", role: "moderator" as const, performanceScore: 72, responseTime: "5.2", confirmationRate: "68.4", ordersHandled: 760, customerRating: "4.0", weeklyOrders: 24, trend: "-2.5", status: "offline" as const },
    { name: "Hana Mohamed", email: "hana@nexusai.com", role: "confirmation_agent" as const, performanceScore: 90, responseTime: "2.6", confirmationRate: "80.1", ordersHandled: 1290, customerRating: "4.7", weeklyOrders: 40, trend: "3.5", status: "online" as const },
    { name: "Tarek Samir", email: "tarek@nexusai.com", role: "moderator" as const, performanceScore: 76, responseTime: "4.8", confirmationRate: "70.2", ordersHandled: 840, customerRating: "4.1", weeklyOrders: 26, trend: "-0.8", status: "away" as const },
    { name: "Rana Khaled", email: "rana@nexusai.com", role: "confirmation_agent" as const, performanceScore: 89, responseTime: "2.9", confirmationRate: "79.5", ordersHandled: 1180, customerRating: "4.6", weeklyOrders: 36, trend: "2.8", status: "online" as const },
    { name: "Ahmed Fathy", email: "ahmed.f@nexusai.com", role: "moderator" as const, performanceScore: 74, responseTime: "5.0", confirmationRate: "69.8", ordersHandled: 800, customerRating: "4.0", weeklyOrders: 25, trend: "-1.5", status: "offline" as const },
    { name: "Dina Hassan", email: "dina@nexusai.com", role: "confirmation_agent" as const, performanceScore: 86, responseTime: "3.3", confirmationRate: "77.2", ordersHandled: 1080, customerRating: "4.5", weeklyOrders: 33, trend: "1.9", status: "online" as const },
  ];
  await db.insert(teamMembers).values(teamData);
  console.log("Seeded 12 team members");

  const activityData = [
    { agentName: "CEO Agent", action: "Detected declining ROAS on Product 3-in-1 Wireless Charger. Recommended budget reduction of 20%.", type: "recommendation" as const, confidence: 94, impact: "+EGP 12,000/mo", status: "pending" as const },
    { agentName: "Shipping Agent", action: "Bosta delivery rate in Aswan dropped to 72%. Recommend switching to Aramex.", type: "alert" as const, confidence: 88, impact: "+8% delivery", status: "accepted" as const },
    { agentName: "Product Hunter", action: "New winning product found — Smart Water Bottle (margin: 6.5x, demand: 8/10)", type: "analysis" as const, confidence: 91, impact: "+EGP 15,800/mo", status: "completed" as const },
    { agentName: "Finance Agent", action: "Ad spend increased 23% with only 8% revenue increase. Review campaigns.", type: "alert" as const, confidence: 96, impact: "-EGP 8,400", status: "pending" as const },
    { agentName: "Confirmation Agent", action: "12 orders flagged as fake with 96.2% confidence. Auto-cancelled 8 orders.", type: "automation" as const, confidence: 96, impact: "Saved EGP 3,200", status: "completed" as const },
    { agentName: "Creative Director", action: "Generated 5 new ad variations for Kitchen Oil Spray. Predicted CTR: 3.2%", type: "analysis" as const, confidence: 85, impact: "+EGP 5,600/mo", status: "completed" as const },
    { agentName: "HR Agent", action: "Karim Mahmoud response time above target (4.5 min vs 3.0 min). Suggest training.", type: "recommendation" as const, confidence: 82, impact: "+5% team efficiency", status: "pending" as const },
    { agentName: "CEO Agent", action: "Cash flow projected negative in 5 days. Reduce ad spend by 15%.", type: "alert" as const, confidence: 89, impact: "+EGP 24,000", status: "pending" as const },
    { agentName: "Shipping Agent", action: "Mylerz outperforms Bosta in Port Said by 6.2%. Recommend switch.", type: "recommendation" as const, confidence: 87, impact: "+6% delivery", status: "accepted" as const },
    { agentName: "Product Hunter", action: "Wireless Gaming Mouse low potential (market fit: 45%). Recommend pause.", type: "analysis" as const, confidence: 93, impact: "Save EGP 4,200", status: "completed" as const },
    { agentName: "Confirmation Agent", action: "Luxor confirmation rate at 58%. Suggest voice confirmation.", type: "recommendation" as const, confidence: 84, impact: "+15% confirmation", status: "pending" as const },
    { agentName: "Finance Agent", action: "Return rate at 12.3% — above 10% target. Impact: -EGP 11,200/month.", type: "alert" as const, confidence: 91, impact: "-EGP 11,200/mo", status: "pending" as const },
    { agentName: "CEO Agent", action: "Scale Blender campaign — ROAS stable at 4.5x for 14 days. Increase budget 25%.", type: "recommendation" as const, confidence: 95, impact: "+EGP 18,500/mo", status: "accepted" as const },
    { agentName: "Creative Director", action: "Arabic hook outperformed English by 32% in Oil Spray campaign.", type: "analysis" as const, confidence: 88, impact: "+EGP 7,800/mo", status: "completed" as const },
    { agentName: "HR Agent", action: "Optimal shift schedule generated. Peak: 2PM-8PM. 3 agents needed.", type: "automation" as const, confidence: 90, impact: "+12% efficiency", status: "completed" as const },
  ];
  await db.insert(agentActivities).values(activityData);
  console.log("Seeded 15 agent activities");

  const kpiData = [];
  const metrics = ["revenue", "confirmation_rate", "delivery_rate", "net_profit", "roas", "cpa"] as const;
  for (let d = 0; d < 30; d++) {
    for (const metric of metrics) {
      const baseValues: Record<string, number> = {
        revenue: 28000 + Math.sin(d * 0.3) * 8000 + Math.random() * 5000,
        confirmation_rate: 70 + Math.sin(d * 0.2) * 5 + Math.random() * 3,
        delivery_rate: 85 + Math.sin(d * 0.15) * 4 + Math.random() * 3,
        net_profit: 5200 + Math.sin(d * 0.25) * 2000 + Math.random() * 1500,
        roas: 2.8 + Math.sin(d * 0.2) * 0.5 + Math.random() * 0.3,
        cpa: 85 + Math.sin(d * 0.18) * 15 + Math.random() * 10,
      };
      kpiData.push({
        metricName: metric,
        metricValue: String(Math.round(baseValues[metric] * 100) / 100),
        date: `2025-04-${String(d + 1).padStart(2, "0")}`,
      });
    }
  }
  await db.insert(kpiMetrics).values(kpiData);
  console.log("Seeded 180 KPI metrics");

  const creativeData = [
    { productId: 1, type: "ad_copy" as const, title: "Wireless Charger — Egyptian Arabic Copy", content: JSON.stringify({ headline: "3-in-1 Wireless Charger — Charge everything at once!", body: "Tired of cable clutter? One device charges all your devices fast.", cta: "Order Now — EGP 225" }), language: "arabic" as const, tone: "problem_solution" as const, platform: "facebook" as const, predictedCtr: "2.8", engagementScore: 85 },
    { productId: 1, type: "ad_creative" as const, title: "Wireless Charger — Visual Concept A", content: JSON.stringify({ concept: "Problem-Solution layout", visual: "Cluttered cables vs clean desk", headline: "One Charger. Three Devices. Zero Clutter.", cta: "Shop Now — EGP 225" }), language: "english" as const, tone: "problem_solution" as const, platform: "facebook" as const, predictedCtr: "2.4", engagementScore: 78 },
    { productId: 5, type: "ugc_script" as const, title: "Portable Blender — 30s UGC Script", content: JSON.stringify({ hook: "Show messy kitchen + frustrated face", script: "Every morning is chaos! This changed everything. 30 seconds, perfect smoothie. USB rechargeable, take it anywhere.", broll: "Close-up blending, gym scene" }), language: "mixed" as const, tone: "lifestyle" as const, platform: "tiktok" as const, predictedCtr: "3.5", engagementScore: 92 },
    { productId: 5, type: "hook" as const, title: "Blender Hook Ideas", content: JSON.stringify({ hooks: ["Stop wasting money on cafe smoothies!", "Egyptian moms are obsessed with this...", "I saved EGP 2,000/month with this gadget"] }), language: "mixed" as const, tone: "fomo" as const, platform: "universal" as const, predictedCtr: "3.2", engagementScore: 88 },
    { productId: 8, type: "ad_copy" as const, title: "LED Mirror — Arabic Beauty Copy", content: JSON.stringify({ headline: "Smart LED Mirror — Perfect makeup every day!", body: "Dimmable LED lighting — professional makeup at home.", cta: "Buy Now — EGP 159" }), language: "arabic" as const, tone: "lifestyle" as const, platform: "instagram" as const, predictedCtr: "3.1", engagementScore: 87 },
    { productId: 2, type: "ad_creative" as const, title: "UV Sanitizer — Before/After Concept", content: JSON.stringify({ concept: "Before/After comparison", visual: "Dirty phone vs clean phone", headline: "Your Phone Has 18x More Bacteria Than a Toilet Seat", cta: "Get Clean — EGP 99" }), language: "english" as const, tone: "urgent" as const, platform: "facebook" as const, predictedCtr: "3.4", engagementScore: 90 },
  ];
  await db.insert(creatives).values(creativeData);
  console.log("Seeded 6 creatives");

  const landingPageData = [
    { name: "Wireless Charger — Problem/Solution", productId: 1, template: "problem_solution", sections: JSON.stringify({ hero: { headline: "Charge All Devices with One Stand", subhead: "No more cable chaos", cta: "Get Yours — EGP 225" }, problem: { title: "Tired of Cable Clutter?", points: ["Multiple chargers", "Tangled cables", "Slow charging"] }, solution: { title: "3-in-1 Wireless Solution", features: ["Fast wireless charging", "Sleek design", "LED indicators"] }, socialProof: { testimonials: 24, rating: "4.8/5" }, offer: { price: 225, originalPrice: 450, bonus: "Free organizer" }, scarcity: { stock: 47, timer: true }, faq: [{ q: "Does it work with Samsung?", a: "Yes! All Qi-enabled devices." }] }), conversionRate: "4.2", isActive: true },
    { name: "Blender — Lifestyle Template", productId: 5, template: "lifestyle", sections: JSON.stringify({ hero: { headline: "Smoothies Anywhere, Anytime", subhead: "USB rechargeable portable blender", cta: "Order Now — EGP 89" }, problem: { title: "No Time for Healthy Drinks?", points: ["Expensive cafe smoothies", "Bulky blenders", "No power at gym"] }, solution: { title: "Blend in 30 Seconds", features: ["USB-C rechargeable", "Self-cleaning", "BPA-free"] }, socialProof: { testimonials: 156, rating: "4.9/5" }, offer: { price: 89, originalPrice: 179, bonus: "Recipe e-book" }, scarcity: { stock: 89, timer: true }, faq: [{ q: "Battery life?", a: "15 blends per charge." }] }), conversionRate: "3.8", isActive: true },
  ];
  await db.insert(landingPages).values(landingPageData);
  console.log("Seeded 2 landing pages");

  const recommendationData = [
    { agentName: "CEO Agent", title: "Scale Product Wireless Charger — ROAS at 4.1x. Increase budget 25%.", description: "Consistent performance over 7 days. Scaling will capture more market share.", confidence: 94, impact: "+EGP 12,000/mo", status: "pending" as const, category: "scale" },
    { agentName: "CEO Agent", title: "Stop Campaign Summer_Sale_Alex — ROAS at 1.8x, below breakeven.", description: "Audience fatigue after 3 weeks. Stop to prevent further losses.", confidence: 96, impact: "Save EGP 5,400/mo", status: "pending" as const, category: "stop" },
    { agentName: "Shipping Agent", title: "Switch Luxor shipments from Bosta to Aramex — 14% better delivery.", description: "Aramex achieves 86% delivery vs Bosta 72% in Luxor.", confidence: 88, impact: "+14% delivery", status: "accepted" as const, category: "optimize" },
    { agentName: "Finance Agent", title: "Cash flow projected negative in 5 days. Reduce ad spend 15%.", description: "COD collection cycle 7 days while ad spend is daily.", confidence: 89, impact: "+EGP 24,000", status: "pending" as const, category: "finance" },
    { agentName: "Confirmation Agent", title: "Add voice confirmation for orders >EGP 500 in Asyut and Qena.", description: "Fake order rate 18% in Upper Egypt vs 4% national average.", confidence: 87, impact: "-62% fake orders", status: "pending" as const, category: "automation" },
    { agentName: "HR Agent", title: "Additional training for Karim Mahmoud — response time 50% above target.", description: "Response time 4.5 min vs team average 3.2 min.", confidence: 82, impact: "+5% efficiency", status: "pending" as const, category: "training" },
  ];
  await db.insert(recommendations).values(recommendationData);
  console.log("Seeded 6 recommendations");

  const templateData = [
    { name: "Order Confirmation — Arabic", type: "confirmation" as const, content: "Hello {{name}}! Your order #{{orderId}} for {{product}} (EGP {{amount}}) is ready. Reply YES to confirm or NO to cancel. Thank you!", language: "arabic" as const },
    { name: "Order Confirmation — English", type: "confirmation" as const, content: "Hi {{name}}! Your order #{{orderId}} for {{product}} (EGP {{amount}}) is ready for confirmation. Reply YES to confirm or NO to cancel.", language: "english" as const },
    { name: "Follow-up Reminder", type: "follow_up" as const, content: "Hi {{name}}! We have not received a response for order #{{orderId}}. Are you still interested? Reply YES to confirm. Offer ends in 24 hours!", language: "arabic" as const },
    { name: "Shipping Notification", type: "reminder" as const, content: "Your order #{{orderId}} is on the way! Track: {{tracking}}. Expected delivery in {{days}} days.", language: "arabic" as const },
    { name: "Cancellation Confirmation", type: "cancellation" as const, content: "Your order #{{orderId}} has been cancelled successfully. We welcome your order again anytime!", language: "arabic" as const },
  ];
  await db.insert(whatsappTemplates).values(templateData);
  console.log("Seeded 5 WhatsApp templates");

  console.log("Seed complete!");
}

seed().catch(console.error);

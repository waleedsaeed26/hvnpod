import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin user
  const adminPassword = await hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@hvnpod.com" },
    update: {},
    create: {
      name: "HVNPOD Admin",
      email: "admin@hvnpod.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Categories
  const acousticPods = await prisma.category.upsert({
    where: { slug: "acoustic-pods" },
    update: {},
    create: {
      name: "Acoustic Pods",
      nameAr: "بودات صوتية",
      slug: "acoustic-pods",
      description: "Premium acoustic pods for focused work, calls, and meetings.",
      descriptionAr: "بودات صوتية فاخرة للعمل المركّز والمكالمات والاجتماعات.",
      order: 1,
      comingSoon: false,
    },
  });

  const gamingDesks = await prisma.category.upsert({
    where: { slug: "gaming-desks" },
    update: {},
    create: {
      name: "Gaming & Coding Desks",
      nameAr: "مكاتب الألعاب والبرمجة",
      slug: "gaming-desks",
      description: "Smart problem-solving desks designed for extended focus sessions.",
      descriptionAr: "مكاتب ذكية مصممة لجلسات التركيز المطوّلة.",
      order: 2,
      comingSoon: true,
    },
  });

  const chairs = await prisma.category.upsert({
    where: { slug: "ergonomic-chairs" },
    update: {},
    create: {
      name: "Ergonomic Chairs",
      nameAr: "كراسي مريحة",
      slug: "ergonomic-chairs",
      description: "Architecturally designed seating for modern workspaces.",
      descriptionAr: "مقاعد مصممة معمارياً لمساحات العمل الحديثة.",
      order: 3,
      comingSoon: true,
    },
  });

  const capsuleHomes = await prisma.category.upsert({
    where: { slug: "capsule-homes" },
    update: {},
    create: {
      name: "Capsule Homes",
      nameAr: "منازل كبسولات",
      slug: "capsule-homes",
      description: "Modular living spaces for the future of housing.",
      descriptionAr: "مساحات معيشة معيارية لمستقبل السكن.",
      order: 4,
      comingSoon: true,
    },
  });

  const capsuleHotels = await prisma.category.upsert({
    where: { slug: "capsule-hotels" },
    update: {},
    create: {
      name: "Capsule Hotel Rooms",
      nameAr: "غرف فندقية كبسولات",
      slug: "capsule-hotels",
      description: "Smart hospitality solutions for modern accommodation.",
      descriptionAr: "حلول ضيافة ذكية للإقامة الحديثة.",
      order: 5,
      comingSoon: true,
    },
  });

  // Products - HVNPOD One (3 tiers)
  const oneSpecs = JSON.stringify({
    acoustics: "30 dB",
    ventilation: "Built-in air circulation",
    power: "2x power outlets, 1x USB-C",
    lighting: "Adjustable LED",
    dimensions: "120cm x 120cm x 230cm",
    weight: "~280 kg",
  });

  await prisma.product.upsert({
    where: { sku: "HVN-ONE-CORE" },
    update: {},
    create: {
      name: "HVNPOD One — Core",
      nameAr: "HVNPOD One — Core",
      slug: "hvnpod-one-core",
      description: "The essential solo privacy pod. 30 dB acoustic isolation, built-in ventilation, and integrated power. Perfect for calls and focused work.",
      descriptionAr: "بود الخصوصية الفردي الأساسي. عزل صوتي 30 ديسيبل، تهوية مدمجة، وطاقة متكاملة. مثالي للمكالمات والعمل المركّز.",
      shortDesc: "Essential acoustic package for solo focus",
      shortDescAr: "حزمة صوتية أساسية للتركيز الفردي",
      model: "ONE",
      tier: "CORE",
      price: 85000,
      currency: "EGP",
      sku: "HVN-ONE-CORE",
      categoryId: acousticPods.id,
      featured: true,
      published: true,
      stock: 50,
      specs: oneSpecs,
      capacity: "1 person",
      colors: JSON.stringify(["cream", "charcoal", "forest", "blue"]),
      features: JSON.stringify(["30 dB acoustic isolation", "Built-in ventilation", "2x power outlets", "LED lighting", "Plug & play installation"]),
      featuresAr: JSON.stringify(["عزل صوتي 30 ديسيبل", "تهوية مدمجة", "مخرجين طاقة", "إضاءة LED", "تركيب سهل"]),
    },
  });

  await prisma.product.upsert({
    where: { sku: "HVN-ONE-PLUS" },
    update: {},
    create: {
      name: "HVNPOD One — Plus",
      nameAr: "HVNPOD One — Plus",
      slug: "hvnpod-one-plus",
      description: "Enhanced materials and smart lighting for an elevated solo experience. Everything in Core plus premium acoustic panels and adjustable ambient lighting.",
      descriptionAr: "مواد محسّنة وإضاءة ذكية لتجربة فردية مرتفعة. كل ما في Core مع ألواح صوتية فاخرة وإضاءة محيطة قابلة للتعديل.",
      shortDesc: "Enhanced materials + smart lighting",
      shortDescAr: "مواد محسّنة + إضاءة ذكية",
      model: "ONE",
      tier: "PLUS",
      price: 105000,
      currency: "EGP",
      sku: "HVN-ONE-PLUS",
      categoryId: acousticPods.id,
      featured: false,
      published: true,
      stock: 30,
      specs: oneSpecs,
      capacity: "1 person",
      colors: JSON.stringify(["cream", "charcoal", "forest", "blue"]),
      features: JSON.stringify(["All Core features", "Premium acoustic panels", "Smart ambient lighting", "Enhanced ventilation", "USB-C fast charging"]),
      featuresAr: JSON.stringify(["كل مميزات Core", "ألواح صوتية فاخرة", "إضاءة ذكية محيطة", "تهوية محسّنة", "شحن سريع USB-C"]),
    },
  });

  await prisma.product.upsert({
    where: { sku: "HVN-ONE-SIG" },
    update: {},
    create: {
      name: "HVNPOD One — Signature",
      nameAr: "HVNPOD One — Signature",
      slug: "hvnpod-one-signature",
      description: "The premium solo pod experience. Top-tier materials, advanced climate control, and every convenience integrated seamlessly.",
      descriptionAr: "تجربة البود الفردي الفاخرة. مواد عالية المستوى، تحكم مناخي متقدم، وكل وسائل الراحة مدمجة بسلاسة.",
      shortDesc: "Premium finish + conveniences",
      shortDescAr: "تشطيب فاخر + وسائل راحة",
      model: "ONE",
      tier: "SIGNATURE",
      price: 130000,
      currency: "EGP",
      sku: "HVN-ONE-SIG",
      categoryId: acousticPods.id,
      featured: false,
      published: true,
      stock: 20,
      specs: oneSpecs,
      capacity: "1 person",
      colors: JSON.stringify(["cream", "charcoal", "forest", "blue"]),
      features: JSON.stringify(["All Plus features", "Premium wood finish interior", "Advanced climate control", "Wireless charging pad", "Motion-activated lighting", "Premium ergonomic chair"]),
      featuresAr: JSON.stringify(["كل مميزات Plus", "تشطيب داخلي خشبي فاخر", "تحكم مناخي متقدم", "شحن لاسلكي", "إضاءة بمستشعر حركة", "كرسي مريح فاخر"]),
    },
  });

  // Products - HVNPOD Duo (3 tiers)
  const duoSpecs = JSON.stringify({
    acoustics: "30 dB",
    ventilation: "Enhanced dual-fan system",
    power: "4x power outlets, 2x USB-C",
    lighting: "Dual-zone LED",
    dimensions: "150cm x 120cm x 230cm",
    weight: "~380 kg",
  });

  await prisma.product.upsert({
    where: { sku: "HVN-DUO-CORE" },
    update: {},
    create: {
      name: "HVNPOD Duo — Core",
      nameAr: "HVNPOD Duo — Core",
      slug: "hvnpod-duo-core",
      description: "Private space for two. Ideal for 1:1 meetings, interviews, and mentoring sessions with full acoustic privacy.",
      descriptionAr: "مساحة خاصة لشخصين. مثالي للاجتماعات الفردية والمقابلات وجلسات التوجيه مع خصوصية صوتية كاملة.",
      shortDesc: "Essential two-person privacy pod",
      model: "DUO",
      tier: "CORE",
      price: 132000,
      currency: "EGP",
      sku: "HVN-DUO-CORE",
      categoryId: acousticPods.id,
      featured: true,
      published: true,
      stock: 30,
      specs: duoSpecs,
      capacity: "2 persons",
      colors: JSON.stringify(["cream", "charcoal", "forest", "blue"]),
      features: JSON.stringify(["30 dB acoustic isolation", "Dual ventilation", "4x power outlets", "Dual-zone LED lighting", "Plug & play installation"]),
    },
  });

  await prisma.product.upsert({
    where: { sku: "HVN-DUO-PLUS" },
    update: {},
    create: {
      name: "HVNPOD Duo — Plus",
      nameAr: "HVNPOD Duo — Plus",
      slug: "hvnpod-duo-plus",
      description: "Enhanced collaboration space with premium materials and smart features for productive two-person meetings.",
      model: "DUO",
      tier: "PLUS",
      price: 160000,
      currency: "EGP",
      sku: "HVN-DUO-PLUS",
      categoryId: acousticPods.id,
      published: true,
      stock: 20,
      specs: duoSpecs,
      capacity: "2 persons",
      colors: JSON.stringify(["cream", "charcoal", "forest", "blue"]),
      features: JSON.stringify(["All Core features", "Premium acoustic panels", "Smart ambient lighting", "Enhanced climate control", "Integrated whiteboard"]),
    },
  });

  await prisma.product.upsert({
    where: { sku: "HVN-DUO-SIG" },
    update: {},
    create: {
      name: "HVNPOD Duo — Signature",
      nameAr: "HVNPOD Duo — Signature",
      slug: "hvnpod-duo-signature",
      description: "The premium two-person meeting experience. Every detail refined for productive, comfortable collaboration.",
      model: "DUO",
      tier: "SIGNATURE",
      price: 195000,
      currency: "EGP",
      sku: "HVN-DUO-SIG",
      categoryId: acousticPods.id,
      published: true,
      stock: 15,
      specs: duoSpecs,
      capacity: "2 persons",
      colors: JSON.stringify(["cream", "charcoal", "forest", "blue"]),
      features: JSON.stringify(["All Plus features", "Premium wood finish", "Advanced climate control", "Wireless charging", "Video conferencing setup", "Premium seating"]),
    },
  });

  // Products - HVNPOD Meet (3 tiers)
  const meetSpecs = JSON.stringify({
    acoustics: "30 dB",
    ventilation: "Quad-fan climate system",
    power: "6x power outlets, 4x USB-C",
    lighting: "Multi-zone LED",
    dimensions: "230cm x 200cm x 230cm",
    weight: "~650 kg",
  });

  await prisma.product.upsert({
    where: { sku: "HVN-MEET-CORE" },
    update: {},
    create: {
      name: "HVNPOD Meet — Core",
      nameAr: "HVNPOD Meet — Core",
      slug: "hvnpod-meet-core",
      description: "A complete compact meeting room for up to four. Perfect for team huddles, client calls, and presentations.",
      descriptionAr: "غرفة اجتماعات مدمجة كاملة لأربعة أشخاص. مثالي للاجتماعات السريعة ومكالمات العملاء والعروض التقديمية.",
      shortDesc: "Compact meeting room for 4",
      model: "MEET",
      tier: "CORE",
      price: 187000,
      currency: "EGP",
      sku: "HVN-MEET-CORE",
      categoryId: acousticPods.id,
      featured: true,
      published: true,
      stock: 20,
      specs: meetSpecs,
      capacity: "4 persons",
      colors: JSON.stringify(["cream", "charcoal", "forest", "blue"]),
      features: JSON.stringify(["30 dB acoustic isolation", "Quad ventilation", "6x power outlets", "Multi-zone lighting", "Meeting table included"]),
    },
  });

  await prisma.product.upsert({
    where: { sku: "HVN-MEET-PLUS" },
    update: {},
    create: {
      name: "HVNPOD Meet — Plus",
      nameAr: "HVNPOD Meet — Plus",
      slug: "hvnpod-meet-plus",
      description: "Enhanced meeting space with premium materials, smart lighting, and integrated presentation capabilities.",
      model: "MEET",
      tier: "PLUS",
      price: 230000,
      currency: "EGP",
      sku: "HVN-MEET-PLUS",
      categoryId: acousticPods.id,
      published: true,
      stock: 15,
      specs: meetSpecs,
      capacity: "4 persons",
      colors: JSON.stringify(["cream", "charcoal", "forest", "blue"]),
      features: JSON.stringify(["All Core features", "Premium acoustic panels", "Smart ambient lighting", "Enhanced climate control", "Display mount included"]),
    },
  });

  await prisma.product.upsert({
    where: { sku: "HVN-MEET-SIG" },
    update: {},
    create: {
      name: "HVNPOD Meet — Signature",
      nameAr: "HVNPOD Meet — Signature",
      slug: "hvnpod-meet-signature",
      description: "The ultimate compact meeting experience. Premium finish, advanced AV integration, and maximum comfort for four.",
      model: "MEET",
      tier: "SIGNATURE",
      price: 280000,
      currency: "EGP",
      sku: "HVN-MEET-SIG",
      categoryId: acousticPods.id,
      published: true,
      stock: 10,
      specs: meetSpecs,
      capacity: "4 persons",
      colors: JSON.stringify(["cream", "charcoal", "forest", "blue"]),
      features: JSON.stringify(["All Plus features", "Premium wood finish", "Full AV integration", "Advanced climate control", "Wireless presentation", "Premium seating for 4"]),
    },
  });

  // Blog posts
  await prisma.blogPost.upsert({
    where: { slug: "why-acoustic-privacy-matters" },
    update: {},
    create: {
      title: "Why Acoustic Privacy Matters in Modern Offices",
      titleAr: "لماذا الخصوصية الصوتية مهمة في المكاتب الحديثة",
      slug: "why-acoustic-privacy-matters",
      excerpt: "Open-plan offices promised collaboration. They delivered distraction. Here's why acoustic privacy is the missing piece.",
      excerptAr: "المكاتب المفتوحة وعدت بالتعاون. لكنها قدمت التشتت. إليك لماذا الخصوصية الصوتية هي القطعة المفقودة.",
      content: "Open-plan offices were designed to foster collaboration and spontaneous conversation. But research consistently shows they do the opposite — increasing stress, reducing productivity, and making private conversations nearly impossible.\n\n## The Real Cost of Noise\n\nStudies show that office workers lose an average of 86 minutes per day to noise-related distractions. That's over 7 hours per week of lost productivity per employee.\n\n## The Privacy Gap\n\nBeyond noise, there's a fundamental privacy problem. HR conversations, client calls, and sensitive discussions require spaces that most open offices simply don't provide.\n\n## The HVNPOD Solution\n\nAcoustic pods solve both problems simultaneously — providing 30 dB of sound isolation in a plug-and-play format that requires no construction, no disruption, and no compromise on design quality.",
      coverImage: "/images/journal/future-of-office-privacy.jpg",
      published: true,
      authorName: "HVNPOD Team",
      category: "JOURNAL",
      tags: "acoustics,office,productivity",
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "choosing-the-right-pod-size" },
    update: {},
    create: {
      title: "One, Duo, or Meet: Choosing the Right Pod Size",
      titleAr: "One أو Duo أو Meet: اختيار حجم البود المناسب",
      slug: "choosing-the-right-pod-size",
      excerpt: "A practical guide to selecting the right HVNPOD model based on your team's actual needs.",
      excerptAr: "دليل عملي لاختيار موديل HVNPOD المناسب بناءً على احتياجات فريقك الفعلية.",
      content: "Choosing the right pod starts with understanding how your team actually uses private space. Here's a framework.\n\n## HVNPOD One: Solo Focus\n\nBest for: Individual calls, deep work, video meetings. If your team's primary need is quiet space for one person at a time, start here.\n\n## HVNPOD Duo: Private Collaboration\n\nBest for: 1:1 meetings, interviews, mentoring. If you frequently need space for two-person conversations, the Duo offers the right balance.\n\n## HVNPOD Meet: Compact Meetings\n\nBest for: Team huddles, client calls, presentations. When you need a proper meeting room without the construction project, Meet delivers.",
      coverImage: "/images/journal/design-philosophy.jpg",
      published: true,
      authorName: "HVNPOD Team",
      category: "JOURNAL",
      tags: "guide,products,workspace",
    },
  });

  // FAQs
  const faqs = [
    { question: "How long does delivery take?", questionAr: "كم يستغرق التسليم؟", answer: "Standard lead time is 2-3 weeks from order confirmation. We'll coordinate the delivery and installation at a time that works for your office.", answerAr: "مدة التسليم القياسية 2-3 أسابيع من تأكيد الطلب. سننسق التسليم والتركيب في وقت يناسب مكتبك.", category: "delivery" },
    { question: "Do pods require any construction work?", questionAr: "هل البودات تحتاج أعمال إنشاء؟", answer: "No. HVNPOD pods are fully plug-and-play. They arrive assembled and require only a standard power outlet. No construction, no permits, no downtime.", answerAr: "لا. بودات HVNPOD جاهزة للتوصيل تماماً. تصل مجمعة وتحتاج فقط مأخذ طاقة عادي. بدون إنشاء، بدون تصاريح، بدون توقف.", category: "delivery" },
    { question: "What acoustic performance do the pods achieve?", questionAr: "ما الأداء الصوتي الذي تحققه البودات؟", answer: "All HVNPOD models achieve 30 dB of sound reduction, which effectively eliminates speech intelligibility from the outside. Conversations inside the pod remain private.", answerAr: "جميع موديلات HVNPOD تحقق 30 ديسيبل من تخفيض الصوت، مما يلغي فعلياً وضوح الكلام من الخارج. المحادثات داخل البود تبقى خاصة.", category: "products" },
    { question: "How is the pod ventilated?", questionAr: "كيف يتم تهوية البود؟", answer: "Each pod has a built-in ventilation system that circulates fresh air continuously without compromising acoustic performance. The system operates quietly below ambient noise levels.", answerAr: "كل بود لديه نظام تهوية مدمج يوزع الهواء النقي باستمرار بدون التأثير على الأداء الصوتي. النظام يعمل بهدوء تحت مستويات الضوضاء المحيطة.", category: "products" },
    { question: "What warranty do you offer?", questionAr: "ما الضمان المقدم؟", answer: "All HVNPOD products come with a 2-year comprehensive warranty covering structural integrity, electrical components, ventilation systems, and acoustic performance.", answerAr: "جميع منتجات HVNPOD تأتي بضمان شامل لمدة سنتين يغطي السلامة الهيكلية والمكونات الكهربائية وأنظمة التهوية والأداء الصوتي.", category: "warranty" },
    { question: "Can I try before I buy?", questionAr: "هل يمكنني التجربة قبل الشراء؟", answer: "Yes. We offer live trials where you can experience the pod in person. Contact us to book a trial at our showroom or arrange a demo at your office.", answerAr: "نعم. نقدم تجارب حية حيث يمكنك تجربة البود شخصياً. تواصل معنا لحجز تجربة في صالة العرض أو ترتيب عرض في مكتبك.", category: "ordering" },
    { question: "Do you offer volume discounts?", questionAr: "هل تقدمون خصومات كمية؟", answer: "Yes. 3-5 units: 5% discount. 6-10 units: 8% discount. 10+ units: 12% discount. Contact us for a custom quote.", answerAr: "نعم. 3-5 وحدات: خصم 5%. 6-10 وحدات: خصم 8%. أكثر من 10 وحدات: خصم 12%. تواصل معنا لعرض سعر مخصص.", category: "ordering" },
    { question: "How do I maintain my pod?", questionAr: "كيف أحافظ على البود؟", answer: "HVNPOD pods require minimal maintenance. Wipe surfaces with a damp cloth, clean the glass with standard glass cleaner, and the ventilation filters should be checked every 6 months.", answerAr: "بودات HVNPOD تحتاج صيانة بسيطة. امسح الأسطح بقطعة قماش مبللة، نظف الزجاج بمنظف زجاج عادي، وفحص فلاتر التهوية كل 6 أشهر.", category: "maintenance" },
  ];

  for (let i = 0; i < faqs.length; i++) {
    await prisma.fAQ.create({
      data: { ...faqs[i], order: i + 1 },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

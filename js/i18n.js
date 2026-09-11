/* ==========================================================================
   CV Builder — i18n
   Bilingual EN / AR with RTL flip and persistence.
   ========================================================================== */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'cvbuilder-lang';
  const DEFAULT_LANG = 'en';

  // Translation table. Keys are dot-notation: nav.home, hero.title, etc.
  const STRINGS = {
    en: {
      nav: {
        home: 'Home',
        templates: 'Templates',
        categories: 'Categories',
        how: 'How it works',
        jobMatching: 'Job matching',
        pricing: 'Pricing',
        login: 'Log in',
        getStarted: 'Get started',
        exit: 'Exit'
      },
      hero: {
        eyebrow: 'Built for serious job seekers',
        titleA: 'Build a Resume That',
        titleB: 'Matches Your Career Goals',
        lead: 'Create professional, ATS-friendly resumes designed for your industry. Pick a template built for your role, customize it, and download a polished CV in minutes.',
        ctaPrimary: 'Create Your CV',
        ctaSecondary: 'Explore Templates',
        trust: '4.9/5 from 12,000+ job seekers'
      },
      logos: { caption: 'Used by professionals hired at' },
      showcase: {
        eyebrow: 'Template library',
        title: 'Professional templates, every style',
        lead: '12 carefully designed templates across 4 career tracks. Each one is ATS-tested and built for real hiring workflows.',
        browse: 'Browse all 12 templates',
        preview: 'Preview',
        use: 'Use template',
        atsTitle: 'ATS compatibility'
      },
      categories: {
        eyebrow: 'Career tracks',
        title: 'Templates built for your role',
        lead: 'Pick a career field and we\'ll surface only the templates that work for it. No scrolling through generic designs.',
        roles: 'Roles',
        templates: 'Templates'
      },
      how: {
        eyebrow: 'How it works',
        title: 'From blank page to job-ready',
        lead: 'Four steps. No design skills needed.',
        s1Title: 'Choose your career',
        s1Desc: 'Pick a field — software, design, marketing, or sales. We\'ll show only relevant templates.',
        s2Title: 'Select a template',
        s2Desc: 'Browse ATS-tested templates. Filter by style, role, and seniority.',
        s3Title: 'Customize',
        s3Desc: 'Fill in your details with a live preview. Switch templates anytime — your content stays.',
        s4Title: 'Download & apply',
        s4Desc: 'Export to print-ready HTML or print to PDF. Ready to submit.'
      },
      analyzer: {
        eyebrow: 'Job matching',
        title: 'See which template fits a job',
        lead: 'Paste a job description. We\'ll detect the role, surface the keywords, and recommend the best template for it.',
        inputTitle: 'Paste a job description',
        clear: 'Clear',
        placeholder: 'Paste a job description here. Try a Senior Backend Developer posting, a UX Designer role, or a Media Buyer job...',
        trySample: 'Try a sample:',
        sampleBackend: 'Backend Engineer',
        sampleFrontend: 'Frontend Developer',
        sampleBuyer: 'Media Buyer',
        analyze: 'Analyze job description',
        emptyTitle: 'Paste a job description',
        emptyDesc: 'We\'ll detect the role category, surface matching skills, and suggest the best template.',
        complete: 'Analysis complete',
        recommended: 'Recommended template',
        atsCompatible: 'ATS compatible',
        useTemplate: 'Use this template',
        seeMore: 'See more',
        detected: 'Detected keywords',
        missing: 'Missing keywords to consider',
        confidence: 'Category confidence',
        shortInput: 'Paste a fuller job description (at least 20 characters)',
        noSkills: 'No specific skills detected yet. Paste a fuller job description.',
        comprehensive: 'Description looks comprehensive. Add industry-standard tools to strengthen your CV.',
        failed: 'Failed to load'
      },
      features: {
        eyebrow: 'Why CV Builder',
        title: 'Built to get you hired',
        lead: 'The small things that make a difference when recruiters and ATS systems read your resume.',
        f1Title: 'ATS optimized',
        f1Desc: 'Every template is tested against major applicant tracking systems. Your resume parses cleanly the first time.',
        f2Title: 'Professional templates',
        f2Desc: 'Designed by recruiters and product designers. No clip-art, no gimmicks — only layouts that read well.',
        f3Title: 'Career-based suggestions',
        f3Desc: 'Recommendations tailored to your field. A backend engineer sees different templates than a media buyer.',
        f4Title: 'Live preview',
        f4Desc: 'What you type is what you get. Switch templates without losing your content. Export to print-ready HTML or PDF.',
        f5Title: 'Easy customization',
        f5Desc: 'Add, remove, and rearrange sections. Your CV, your structure — without fighting a drag-and-drop editor.',
        f6Title: 'Job description matching',
        f6Desc: 'Paste a posting, get an analysis of what skills and keywords the role emphasizes, and how your CV stacks up.'
      },
      pricing: {
        eyebrow: 'Pricing',
        title: 'Simple plans, real value',
        lead: 'Start free. Upgrade when you need more templates, more customization, or job-matching features.',
        free: 'Free',
        freePrice: 'forever',
        freeDesc: 'For your first CV or two. All core templates, all core features.',
        pro: 'Pro',
        proPrice: '/ month',
        proDesc: 'For active job seekers who want every template and every customization.',
        career: 'Career',
        careerPrice: '/ month',
        careerDesc: 'For the full job search — matching, cover letters, and LinkedIn optimization.',
        popular: 'Most popular',
        basicTemplates: '4 basic templates',
        basicBuilder: 'Basic builder',
        livePreview: 'Live preview',
        htmlDownload: 'HTML download',
        premium: 'Premium templates',
        jobMatching: 'Job matching',
        allTemplates: 'All 12 templates',
        advancedCustomization: 'Advanced customization',
        htmlPdfExport: 'HTML & PDF export',
        coverLetters: 'Cover letters',
        everythingInPro: 'Everything in Pro',
        linkedin: 'LinkedIn optimization',
        unlimitedCvs: 'Unlimited CVs',
        priority: 'Priority support',
        getStarted: 'Get started',
        startTrial: 'Start 14-day trial',
        startCareer: 'Start trial'
      },
      cta: {
        title: 'Ready to ship your next CV?',
        lead: 'Pick a template, fill in your details, download a polished resume in under 10 minutes.',
        primary: 'Create Your CV',
        secondary: 'Explore Templates'
      },
      footer: {
        tagline: 'A premium resume builder for serious job seekers. ATS-friendly templates, designed for real hiring workflows.',
        product: 'Product',
        company: 'Company',
        resources: 'Resources',
        about: 'About',
        careers: 'Careers',
        contact: 'Contact',
        github: 'GitHub',
        guides: 'Resume guides',
        blog: 'Blog',
        changelog: 'Changelog',
        support: 'Support',
        copyright: 'All rights reserved.',
        privacy: 'Privacy',
        terms: 'Terms',
        cookies: 'Cookies'
      },
      templatesPage: {
        eyebrow: 'Template library',
        title: 'Pick the right template for your career',
        lead: '12 ATS-tested templates. Filter by career track, then preview any layout to see the details.',
        all: 'All templates',
        search: 'Search templates, roles, styles...',
        noMatch: 'No templates match your filters. Try another career field.',
        bestFor: 'Best for',
        keepBrowsing: 'Keep browsing',
        useThis: 'Use this template'
      },
      builder: {
        livePreview: 'Live preview',
        savedAuto: 'Your changes are saved automatically.',
        printPdf: 'Print to PDF',
        reset: 'Reset',
        download: 'Download',
        chooseTemplate: 'Choose template',
        seeAll: 'See all',
        tabs: { personal: 'Personal', experience: 'Experience', education: 'Education', extras: 'Skills & Projects' },
        personal: {
          title: 'Personal information',
          firstName: 'First name',
          lastName: 'Last name',
          role: 'Target role / headline',
          rolePh: 'e.g. Senior Backend Engineer',
          email: 'Email',
          phone: 'Phone',
          location: 'Location',
          locationPh: 'City, Country',
          linkedin: 'LinkedIn',
          linkedinPh: 'linkedin.com/in/...',
          website: 'Website / portfolio',
          websitePh: 'yourdomain.com',
          summary: 'Professional summary',
          summaryPh: '2-4 sentences. Lead with what you do, who you do it for, and the value you bring.',
          hint: 'Keep it tight. Recruiters spend 6-8 seconds on the first scan.'
        },
        experience: {
          title: 'Experience',
          add: 'Add experience',
          remove: 'Remove',
          newItem: 'New experience',
          jobTitle: 'Title',
          company: 'Company',
          location: 'Location',
          start: 'Start',
          end: 'End (or "Present")',
          highlights: 'Highlights (one per line)'
        },
        education: {
          title: 'Education',
          add: 'Add education',
          remove: 'Remove',
          newItem: 'New education',
          degree: 'Degree',
          school: 'School',
          start: 'Start',
          end: 'End',
          details: 'Details (optional)'
        },
        extras: {
          skillsTitle: 'Skills',
          skillsHelp: 'Type a skill and press Enter or comma. Backspace removes the last.',
          skillsPh: 'Type a skill, then Enter',
          projectsTitle: 'Projects',
          addProject: 'Add project',
          remove: 'Remove',
          newProject: 'New project',
          name: 'Name',
          link: 'Link (optional)',
          description: 'Description'
        },
        cv: {
          summary: 'Summary',
          experience: 'Experience',
          education: 'Education',
          skills: 'Skills',
          projects: 'Projects',
          present: 'Present'
        },
        confirm: {
          reset: 'Reset to a fresh sample CV? Your current changes will be lost.',
          downloaded: 'CV downloaded',
          resetDone: 'Reset to sample'
        }
      },
      sample: {
        firstName: 'Alex',
        lastName: 'Morgan',
        role: 'Senior Software Engineer',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexmorgan',
        website: 'alexmorgan.dev',
        summary: 'Senior engineer with 7+ years building scalable web platforms. Specialized in TypeScript, distributed systems, and developer experience. Led teams of 4-8 engineers and shipped products used by millions of users.',
        experience: {
          title: 'Senior Software Engineer',
          company: 'Stripe',
          location: 'Remote',
          start: '2022',
          end: 'Present',
          bullets: [
            'Led migration of payments API to a typed client SDK, reducing integration time by 40%.',
            'Designed and shipped multi-region failover system handling 50k req/s with 99.99% uptime.',
            'Mentored 5 engineers; ran weekly architecture review for the platform team.'
          ]
        },
        experience2: {
          title: 'Software Engineer',
          company: 'Linear',
          location: 'San Francisco, CA',
          start: '2019',
          end: '2022',
          bullets: [
            'Built the real-time sync engine powering collaborative editing across teams.',
            'Reduced cold-start time by 60% through dependency graph optimization.',
            'Owned the design system; contributed 30+ accessible React primitives.'
          ]
        },
        education: {
          degree: 'B.S. Computer Science',
          school: 'University of California, Berkeley',
          start: '2015',
          end: '2019',
          details: ''
        },
        skills: ['TypeScript','React','Node.js','PostgreSQL','AWS','Docker','GraphQL','System Design'],
        project: {
          name: 'OpenSync — Realtime CRDT toolkit',
          link: 'github.com/alexmorgan/opensync',
          description: 'Open-source CRDT library with 2.4k GitHub stars. Used in production by 30+ teams.'
        }
      },
      toggle: { switchTo: 'العربية', current: 'EN' }
    },
    ar: {
      nav: {
        home: 'الرئيسية',
        templates: 'القوالب',
        categories: 'المجالات',
        how: 'كيف يعمل',
        jobMatching: 'مطابقة الوظائف',
        pricing: 'الأسعار',
        login: 'تسجيل الدخول',
        getStarted: 'ابدأ الآن',
        exit: 'خروج'
      },
      hero: {
        eyebrow: 'مصمم للباحثين الجادين عن عمل',
        titleA: 'أنشئ سيرة ذاتية',
        titleB: 'تتوافق مع أهدافك المهنية',
        lead: 'أنشئ سيرًا ذاتية احترافية متوافقة مع أنظمة ATS مصممة لمجالك. اختر قالبًا يناسب دورك، خصّصه، وحمّل سيرة جاهزة خلال دقائق.',
        ctaPrimary: 'أنشئ سيرتك الذاتية',
        ctaSecondary: 'استكشف القوالب',
        trust: '4.9/5 من 12,000 باحث عن عمل'
      },
      logos: { caption: 'يستخدمها محترفون يعملون في' },
      showcase: {
        eyebrow: 'مكتبة القوالب',
        title: 'قوالب احترافية لكل نمط',
        lead: '12 قالبًا مصممًا بعناية عبر 4 مسارات وظيفية. كل قالب مختبر مع أنظمة التوظيف الحقيقية.',
        browse: 'تصفح جميع القوالب (12)',
        preview: 'معاينة',
        use: 'استخدم القالب',
        atsTitle: 'توافق مع ATS'
      },
      categories: {
        eyebrow: 'المسارات المهنية',
        title: 'قوالب مصممة لدورك',
        lead: 'اختر مجالك ونعرض لك القوالب المناسبة فقط. لا حاجة للتمرير في تصاميم عامة.',
        roles: 'الأدوار',
        templates: 'القوالب'
      },
      how: {
        eyebrow: 'كيف يعمل',
        title: 'من صفحة فارغة إلى جاهز للتقديم',
        lead: 'أربع خطوات. لا تحتاج لأي مهارات تصميم.',
        s1Title: 'اختر مجالك',
        s1Desc: 'اختر مجالًا — برمجيات، تصميم، تسويق، أو مبيعات. سنعرض لك القوالب المناسبة فقط.',
        s2Title: 'اختر قالبًا',
        s2Desc: 'تصفح القوالب المختارة بعناية. فلتر حسب النمط والدور والمستوى.',
        s3Title: 'خصص',
        s3Desc: 'املأ بياناتك مع معاينة مباشرة. غيّر القالب في أي وقت — محتواك يبقى كما هو.',
        s4Title: 'حمّل وقدّم',
        s4Desc: 'صدّر كملف HTML جاهز للطباعة أو اطبع PDF. جاهز للتقديم.'
      },
      analyzer: {
        eyebrow: 'مطابقة الوظائف',
        title: 'اكتشف القالب المناسب لوظيفة',
        lead: 'الصق وصف الوظيفة. سنكتشف الدور، نستخرج الكلمات المفتاحية، ونقترح أفضل قالب.',
        inputTitle: 'الصق وصف الوظيفة',
        clear: 'مسح',
        placeholder: 'الصق وصف الوظيفة هنا. جرّب إعلان مطوّر باك إند أول، أو مصمم UX، أو مشتري إعلانات...',
        trySample: 'جرّب عينة:',
        sampleBackend: 'مطوّر باك إند',
        sampleFrontend: 'مطوّر فرونت إند',
        sampleBuyer: 'مشتري إعلانات',
        analyze: 'تحليل وصف الوظيفة',
        emptyTitle: 'الصق وصف الوظيفة',
        emptyDesc: 'سنكتشف المجال، نستخرج المهارات، ونقترح أفضل قالب.',
        complete: 'اكتمل التحليل',
        recommended: 'القالب الموصى به',
        atsCompatible: 'متوافق مع ATS',
        useTemplate: 'استخدم هذا القالب',
        seeMore: 'المزيد',
        detected: 'الكلمات المفتاحية المكتشفة',
        missing: 'كلمات مفتاحية ينصح بإضافتها',
        confidence: 'ثقة التصنيف',
        shortInput: 'الرجاء إدخال وصف أطول (20 حرفًا على الأقل)',
        noSkills: 'لا توجد مهارات محددة بعد. الصق وصفًا أكثر تفصيلًا.',
        comprehensive: 'الوصف شامل. أضف أدوات معيارية في مجالك لتعزيز السيرة الذاتية.',
        failed: 'فشل التحميل'
      },
      features: {
        eyebrow: 'لماذا منشئ السيرة الذاتية',
        title: 'مصمم لتوظف',
        lead: 'التفاصيل الصغيرة التي تصنع الفرق عندما يقرأ المسؤولون أو أنظمة ATS سيرتك الذاتية.',
        f1Title: 'متوافق مع ATS',
        f1Desc: 'كل قالب مختبر مع أنظمة تتبع المتقدمين الرئيسية. سيرتك تُفهم بشكل صحيح من المرة الأولى.',
        f2Title: 'قوالب احترافية',
        f2Desc: 'مصممة من قبل مسؤولي توظيف ومصممي منتج. لا صور، لا حشو — فقط تصاميم تُقرأ بسهولة.',
        f3Title: 'اقتراحات مبنية على مجالك',
        f3Desc: 'توصيات مخصصة لمجالك. مطوّر الباك إند يرى قوالب مختلفة عن مشتري الإعلانات.',
        f4Title: 'معاينة مباشرة',
        f4Desc: 'ما تكتبه هو ما تحصل عليه. غيّر القالب دون فقدان محتواك. صدّر كـ HTML أو PDF.',
        f5Title: 'تخصيص سهل',
        f5Desc: 'أضف، احذف، وأعد ترتيب الأقسام. سيرتك، هيكلك — بدون صراع مع محرر سحب وإفلات.',
        f6Title: 'مطابقة وصف الوظيفة',
        f6Desc: 'الصق إعلانًا، احصل على تحليل للمهارات والكلمات المفتاحية التي يؤكدها الدور.'
      },
      pricing: {
        eyebrow: 'الأسعار',
        title: 'خطط بسيطة، قيمة حقيقية',
        lead: 'ابدأ مجانًا. ارتقِ عندما تحتاج قوالب أكثر، تخصيصًا أعمق، أو ميزات مطابقة الوظائف.',
        free: 'مجاني',
        freePrice: 'للأبد',
        freeDesc: 'لسيرتك الأولى أو الثانية. كل القوالب الأساسية، كل الميزات الأساسية.',
        pro: 'احترافي',
        proPrice: '/ شهريًا',
        proDesc: 'للباحثين النشطين عن عمل الذين يريدون كل قالب وكل تخصيص.',
        career: 'مسيرتي',
        careerPrice: '/ شهريًا',
        careerDesc: 'للبحث الكامل عن عمل — مطابقة، رسائل تغطية، وتحسين LinkedIn.',
        popular: 'الأكثر شيوعًا',
        basicTemplates: '4 قوالب أساسية',
        basicBuilder: 'منشئ أساسي',
        livePreview: 'معاينة مباشرة',
        htmlDownload: 'تحميل HTML',
        premium: 'قوالب مميزة',
        jobMatching: 'مطابقة الوظائف',
        allTemplates: 'كل القوالب (12)',
        advancedCustomization: 'تخصيص متقدم',
        htmlPdfExport: 'تصدير HTML و PDF',
        coverLetters: 'رسائل التغطية',
        everythingInPro: 'كل ميزات الخطة الاحترافية',
        linkedin: 'تحسين LinkedIn',
        unlimitedCvs: 'سير ذاتية غير محدودة',
        priority: 'دعم أولوية',
        getStarted: 'ابدأ الآن',
        startTrial: 'ابدأ تجربة 14 يوم',
        startCareer: 'ابدأ التجربة'
      },
      cta: {
        title: 'هل أنت مستعد لإطلاق سيرتك القادمة؟',
        lead: 'اختر قالبًا، املأ بياناتك، حمّل سيرة جاهزة في أقل من 10 دقائق.',
        primary: 'أنشئ سيرتك الذاتية',
        secondary: 'استكشف القوالب'
      },
      footer: {
        tagline: 'منشئ سير ذاتية مميز للباحثين الجادين عن عمل. قوالب متوافقة مع ATS، مصممة لعمليات التوظيف الحقيقية.',
        product: 'المنتج',
        company: 'الشركة',
        resources: 'الموارد',
        about: 'من نحن',
        careers: 'الوظائف',
        contact: 'تواصل معنا',
        github: 'GitHub',
        guides: 'أدلة السيرة الذاتية',
        blog: 'المدونة',
        changelog: 'سجل التحديثات',
        support: 'الدعم',
        copyright: 'جميع الحقوق محفوظة.',
        privacy: 'الخصوصية',
        terms: 'الشروط',
        cookies: 'الكوكيز'
      },
      templatesPage: {
        eyebrow: 'مكتبة القوالب',
        title: 'اختر القالب المناسب لمسيرتك',
        lead: '12 قالبًا مختبرًا مع ATS. فلتر حسب المسار الوظيفي، ثم عاين أي تصميم لرؤية التفاصيل.',
        all: 'كل القوالب',
        search: 'ابحث في القوالب، الأدوار، الأنماط...',
        noMatch: 'لا توجد قوالب تطابق الفلاتر. جرّب مجالًا آخر.',
        bestFor: 'الأنسب لـ',
        keepBrowsing: 'متابعة التصفح',
        useThis: 'استخدم هذا القالب'
      },
      builder: {
        livePreview: 'معاينة مباشرة',
        savedAuto: 'يتم حفظ تغييراتك تلقائيًا.',
        printPdf: 'طباعة PDF',
        reset: 'إعادة تعيين',
        download: 'تحميل',
        chooseTemplate: 'اختر القالب',
        seeAll: 'عرض الكل',
        tabs: { personal: 'البيانات الشخصية', experience: 'الخبرات', education: 'التعليم', extras: 'المهارات والمشاريع' },
        personal: {
          title: 'المعلومات الشخصية',
          firstName: 'الاسم الأول',
          lastName: 'اسم العائلة',
          role: 'المسمى الوظيفي المستهدف',
          rolePh: 'مثل: مطوّر باك إند أول',
          email: 'البريد الإلكتروني',
          phone: 'الهاتف',
          location: 'الموقع',
          locationPh: 'المدينة، البلد',
          linkedin: 'LinkedIn',
          linkedinPh: 'linkedin.com/in/...',
          website: 'الموقع / المعرض',
          websitePh: 'yourdomain.com',
          summary: 'الملخص المهني',
          summaryPh: 'جملتان إلى أربع. ابدأ بما تفعله، لمن تفعله، والقيمة التي تقدمها.',
          hint: 'اجعله مختصرًا. يقرأ المسؤولون أول 6-8 ثوانٍ.'
        },
        experience: {
          title: 'الخبرات',
          add: 'إضافة خبرة',
          remove: 'حذف',
          newItem: 'خبرة جديدة',
          jobTitle: 'المسمى',
          company: 'الشركة',
          location: 'الموقع',
          start: 'من',
          end: 'إلى (أو "حتى الآن")',
          highlights: 'أبرز الإنجازات (سطر لكل نقطة)'
        },
        education: {
          title: 'التعليم',
          add: 'إضافة تعليم',
          remove: 'حذف',
          newItem: 'تعليم جديد',
          degree: 'الدرجة',
          school: 'المؤسسة',
          start: 'من',
          end: 'إلى',
          details: 'تفاصيل (اختياري)'
        },
        extras: {
          skillsTitle: 'المهارات',
          skillsHelp: 'اكتب مهارة ثم اضغط Enter أو فاصلة. Backspace يحذف الأخيرة.',
          skillsPh: 'اكتب مهارة، ثم Enter',
          projectsTitle: 'المشاريع',
          addProject: 'إضافة مشروع',
          remove: 'حذف',
          newProject: 'مشروع جديد',
          name: 'الاسم',
          link: 'الرابط (اختياري)',
          description: 'الوصف'
        },
        cv: {
          summary: 'الملخص',
          experience: 'الخبرات',
          education: 'التعليم',
          skills: 'المهارات',
          projects: 'المشاريع',
          present: 'حتى الآن'
        },
        confirm: {
          reset: 'إعادة تعيين لعينة جديدة؟ ستفقد تغييراتك الحالية.',
          downloaded: 'تم تحميل السيرة الذاتية',
          resetDone: 'تمت إعادة التعيين للعينة'
        }
      },
      sample: {
        firstName: 'أحمد',
        lastName: 'العلوي',
        role: 'مهندس برمجيات أول',
        email: 'ahmed.alalawi@example.com',
        phone: '+966 50 000 0000',
        location: 'الرياض، السعودية',
        linkedin: 'linkedin.com/in/ahmedalalawi',
        website: 'ahmed.dev',
        summary: 'مهندس أول بخبرة 7+ سنوات في بناء منصات ويب قابلة للتوسع. متخصص في TypeScript، الأنظمة الموزعة، وتجربة المطوّر. قُدت فرقًا من 4-8 مهندسين وأطلقت منتجات يستخدمها ملايين المستخدمين.',
        experience: {
          title: 'مهندس برمجيات أول',
          company: 'Stripe',
          location: 'عن بُعد',
          start: '2022',
          end: 'حتى الآن',
          bullets: [
            'قُدت ترحيل واجهة برمجة المدفوعات إلى SDK مكتوب بأنواع، مما قلل زمن التكامل بنسبة 40%.',
            'صممت وأطلقت نظام failover متعدد المناطق يستوعب 50 ألف طلب/ثانية مع وقت تشغيل 99.99%.',
            'أشرفت على 5 مهندسين؛ أدّيت مراجعة الهندسة المعمارية الأسبوعية لفريق المنصة.'
          ]
        },
        experience2: {
          title: 'مهندس برمجيات',
          company: 'Linear',
          location: 'سان فرانسيسكو، كاليفورنيا',
          start: '2019',
          end: '2022',
          bullets: [
            'بنيت محرّك المزامنة الفورية الذي يدعم التحرير التعاوني بين الفرق.',
            'قلّلت زمن البدء البارد بنسبة 60% من خلال تحسين الرسم البياني للتبعيات.',
            'امتلكت نظام التصميم؛ ساهمت بـ 30+ مكوّن React متاح.'
          ]
        },
        education: {
          degree: 'بكالوريوس علوم الحاسب',
          school: 'جامعة الملك سعود',
          start: '2015',
          end: '2019',
          details: ''
        },
        skills: ['TypeScript','React','Node.js','PostgreSQL','AWS','Docker','GraphQL','تصميم الأنظمة'],
        project: {
          name: 'OpenSync — مكتبة CRDT فورية',
          link: 'github.com/ahmedalalawi/opensync',
          description: 'مكتبة CRDT مفتوحة المصدر مع 2.4k نجمة على GitHub. تُستخدم في الإنتاج من قبل 30+ فريق.'
        }
      },
      toggle: { switchTo: 'English', current: 'AR' }
    }
  };

  const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur']);

  let state = {
    lang: DEFAULT_LANG,
    listeners: new Set()
  };

  // Read stored language at module load so other modules see the right lang
  // even before DOMContentLoaded fires.
  try {
    const _stored = localStorage.getItem(STORAGE_KEY);
    if (_stored && STRINGS[_stored]) state.lang = _stored;
  } catch (e) {}

  function getLang() { return state.lang; }
  function isRTL() { return RTL_LANGS.has(state.lang); }

  /** Resolve a dotted key, with fallback to English if the key is missing in the current language. */
  function t(key, fallback) {
    const parts = key.split('.');
    let cur = STRINGS[state.lang];
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
      else { cur = undefined; break; }
    }
    if (cur == null && state.lang !== DEFAULT_LANG) {
      let en = STRINGS[DEFAULT_LANG];
      for (const p of parts) {
        if (en && typeof en === 'object' && p in en) en = en[p];
        else { en = undefined; break; }
      }
      if (en != null) cur = en;
    }
    if (cur == null) return fallback != null ? fallback : key;
    return cur;
  }

  /** Localize a value that may be a string, a {en, ar} object, or undefined. */
  function pick(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if (state.lang in value) return value[state.lang];
      if (DEFAULT_LANG in value) return value[DEFAULT_LANG];
      const first = Object.values(value)[0];
      return first == null ? '' : first;
    }
    return String(value);
  }

  function setLang(lang, opts) {
    if (!STRINGS[lang]) return;
    const prev = state.lang;
    state.lang = lang;
    const rtl = isRTL();
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    // Apply translations to the DOM
    applyTranslations();
    // Update toggle button
    const btn = document.getElementById('langToggle');
    if (btn) {
      const next = t('toggle.switchTo');
      btn.setAttribute('aria-label', 'Switch to ' + next);
      const label = btn.querySelector('.lang-label');
      if (label) label.textContent = t('toggle.current');
    }
    // Notify subscribers
    state.listeners.forEach(fn => {
      try { fn(lang, prev); } catch (e) { console.error(e); }
    });
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang, prev } }));
  }

  function toggle() {
    setLang(state.lang === 'en' ? 'ar' : 'en');
  }

  /** Walk the DOM and replace text in elements marked with data-i18n="key" or data-i18n-placeholder="key". */
  function applyTranslations(root) {
    const r = root || document;
    // Text content
    r.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      // Allow inner template usage: e.g., <span data-i18n="hero.titleA"></span>
      const val = t(key);
      if (val != null && val !== key) el.textContent = val;
    });
    // Placeholders
    r.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(key);
      if (val != null && val !== key) el.setAttribute('placeholder', val);
    });
    // Title attribute
    r.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = t(key);
      if (val != null && val !== key) el.setAttribute('title', val);
    });
    // aria-label
    r.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const val = t(key);
      if (val != null && val !== key) el.setAttribute('aria-label', val);
    });
  }

  function onChange(fn) { state.listeners.add(fn); return () => state.listeners.delete(fn); }

  function init() {
    // Determine initial language (state.lang was already populated at module load)
    const lang = state.lang;
    if (!STRINGS[lang]) state.lang = DEFAULT_LANG;
    setLang(state.lang, { silent: true });

    // Bind toggle
    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.addEventListener('click', () => toggle());
    }
  }

  const I18n = { t, pick, setLang, getLang, isRTL, toggle, applyTranslations, onChange, init, STRINGS };

  global.CVI18n = I18n;
  document.addEventListener('DOMContentLoaded', () => I18n.init());
})(window);

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCV } from '../context/useCV';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import ATSCleanTemplate from '../templates/ATSCleanTemplate';
import ATSProTemplate from '../templates/ATSProTemplate';
import ATSSimpleTemplate from '../templates/ATSSimpleTemplate';
import ATSBoldTemplate from '../templates/ATSBoldTemplate';
import ATSCompactTemplate from '../templates/ATSCompactTemplate';
import ATSModernTemplate from '../templates/ATSModernTemplate';
import ATSHarvardTemplate from '../templates/ATSHarvardTemplate';
import ATSCenterTemplate from '../templates/ATSCenterTemplate';
import ATSElegantTemplate from '../templates/ATSElegantTemplate';
import PrestigeTemplate from '../templates/PrestigeTemplate';
import ClassicSerifTemplate from '../templates/ClassicSerifTemplate';
import AtlanticBlueTemplate from '../templates/AtlanticBlueTemplate';
import MercuryFlowTemplate from '../templates/MercuryFlowTemplate';
import EditorialRuleTemplate from '../templates/EditorialRuleTemplate';
import SidebarLightTemplate from '../templates/SidebarLightTemplate';
import ArabicNavyTemplate from '../templates/ArabicNavyTemplate';
import ArabicTealSidebarTemplate from '../templates/ArabicTealSidebarTemplate';
import ArabicProTemplate from '../templates/ArabicProTemplate';
import ArabicSlateSidebarTemplate from '../templates/ArabicSlateSidebarTemplate';
import ArabicModernTemplate from '../templates/ArabicModernTemplate';
import ArabicCardTemplate from '../templates/ArabicCardTemplate';
import ArabicEliteTemplate from '../templates/ArabicEliteTemplate';
import ArabicWaveTemplate from '../templates/ArabicWaveTemplate';
import ArabicLuxeTemplate from '../templates/ArabicLuxeTemplate';
import EnglishHorizonTemplate from '../templates/EnglishHorizonTemplate';
import ArabicZafirTemplate from '../templates/ArabicZafirTemplate';
import EnglishApexTemplate from '../templates/EnglishApexTemplate';
import TealProTemplate from '../templates/TealProTemplate';
import RoseElegantTemplate from '../templates/RoseElegantTemplate';
import DarkHeaderTemplate from '../templates/DarkHeaderTemplate';
import VelvetTemplate from '../templates/VelvetTemplate';
import AuroraTemplate from '../templates/AuroraTemplate';
import ArabicGemTemplate from '../templates/ArabicGemTemplate';
import { sampleData, arabicSampleData } from '../utils/sampleData';

const templates = [
  {
    id: 'minimal',
    name: 'Minimal',        arabicName: 'بسيط',
    desc: 'Maximum whitespace, light grey dividers, clean typography.',
    arabicDesc: 'مساحة بيضاء واسعة، فواصل رمادية خفيفة، طباعة نظيفة.',
    color: '#374151',
    component: MinimalTemplate,
    atsScore: null,
  },
  {
    id: 'modern',
    name: 'Modern',         arabicName: 'عصري',
    desc: 'Clean single-column layout with accent headings and pill-style dates — ATS-optimized.',
    arabicDesc: 'تخطيط أحادي العمود نظيف مع عناوين ملوّنة وتواريخ بشكل حبات — محسَّن لأنظمة ATS.',
    color: '#4f46e5',
    component: ModernTemplate,
    atsScore: 95,
  },
  {
    id: 'classic',
    name: 'Classic',        arabicName: 'كلاسيكي',
    desc: 'Centered name with double rule lines and elegant dividers — fully ATS-safe single-column.',
    arabicDesc: 'اسم مركزي مع خطوط مزدوجة وفواصل أنيقة — عمود واحد متوافق بالكامل مع ATS.',
    color: '#1e3a5f',
    component: ClassicTemplate,
    atsScore: 94,
  },
  {
    id: 'creative',
    name: 'Creative',       arabicName: 'إبداعي',
    desc: 'Accent sidebar bar with pill-style headings and colored company names — ATS-friendly.',
    arabicDesc: 'شريط جانبي لوني مع عناوين أقسام بشكل حبات وأسماء شركات ملوّنة — متوافق مع ATS.',
    color: '#7c3aed',
    component: CreativeTemplate,
    atsScore: 92,
  },
  {
    id: 'executive',
    name: 'Executive',      arabicName: 'تنفيذي',
    desc: 'Uppercase name, double-line divider, gold section rule lines.',
    arabicDesc: 'اسم بأحرف كبيرة، خط مزدوج فاصل، خطوط ذهبية للأقسام.',
    color: '#0f2942',
    component: ExecutiveTemplate,
    atsScore: null,
  },
  {
    id: 'atsclean',
    name: 'ATS Clean',      arabicName: 'ATS نظيف',
    desc: 'Ultra-clean single-column layout engineered for maximum ATS parse rate.',
    arabicDesc: 'تصميم نظيف أحادي العمود مُهندس لأعلى معدل قراءة من أنظمة ATS.',
    color: '#1a56a0',
    component: ATSCleanTemplate,
    atsScore: 99,
  },
  {
    id: 'atspro',
    name: 'ATS Pro',         arabicName: 'ATS احترافي',
    desc: 'Professional look with accent header block and skill pills — fully ATS-safe.',
    arabicDesc: 'مظهر احترافي بكتلة رأسية مميزة وبطاقات مهارات — متوافق بالكامل مع ATS.',
    color: '#0f4c75',
    component: ATSProTemplate,
    atsScore: 98,
  },
  {
    id: 'atssimple',
    name: 'ATS Simple',      arabicName: 'ATS بسيط جداً',
    desc: 'Word-processor style — centered header, double-line dividers, maximum parser compatibility.',
    arabicDesc: 'نمط معالج النصوص — رأسية مركزية، فواصل مزدوجة، أقصى توافق مع المحللات.',
    color: '#2d6a9f',
    component: ATSSimpleTemplate,
    atsScore: 100,
  },
  {
    id: 'atsbold',
    name: 'ATS Bold',        arabicName: 'ATS قوي',
    desc: 'Filled accent heading blocks, bullet-point skills grid, strong visual hierarchy.',
    arabicDesc: 'عناوين أقسام بخلفية ملونة، شبكة مهارات بنقاط، تسلسل بصري قوي.',
    color: '#155e75',
    component: ATSBoldTemplate,
    atsScore: 97,
  },
  {
    id: 'atscompact',
    name: 'ATS Compact',     arabicName: 'ATS مضغوط',
    desc: 'Dense layout with tighter spacing — ideal for experienced candidates with lots of content.',
    arabicDesc: 'تخطيط مضغوط بمسافات أصغر — مثالي للمرشحين ذوي الخبرة الواسعة.',
    color: '#1b4f72',
    component: ATSCompactTemplate,
    atsScore: 99,
  },
  {
    id: 'atsmodern',
    name: 'ATS Modern',      arabicName: 'ATS عصري',
    desc: 'Solid accent header stripe, colored section underlines, 3-column skills grid.',
    arabicDesc: 'شريط رأسي ملون، تسطير ملون للأقسام، شبكة مهارات ثلاثية الأعمدة.',
    color: '#0d4f6e',
    component: ATSModernTemplate,
    atsScore: 90,
  },
  {
    id: 'atsharvard',
    name: 'ATS Harvard',     arabicName: 'ATS هارفارد',
    desc: 'Classic Harvard-style — centered name, full-width rules above each section, zero decoration.',
    arabicDesc: 'نمط هارفارد الكلاسيكي — اسم مركزي، خطوط كاملة فوق كل قسم، بدون زخارف.',
    color: '#1a3a5c',
    component: ATSHarvardTemplate,
    atsScore: 100,
  },
  {
    id: 'atscenter',
    name: 'ATS Center',      arabicName: 'ATS توسيط',
    desc: 'Centered name & centered section headings with lines on both sides — fully ATS-safe.',
    arabicDesc: 'اسم وعناوين أقسام في المنتصف مع خطوط على الجانبين — متوافق بالكامل مع ATS.',
    color: '#1a56a0',
    component: ATSCenterTemplate,
    atsScore: 98,
  },
  {
    id: 'atselegant',
    name: 'ATS Elegant',     arabicName: 'ATS أنيق',
    desc: 'Centered bold uppercase headings with a full-width rule below — clean, timeless, ATS-safe.',
    arabicDesc: 'عناوين مركزية بالأحرف الكبيرة مع خط كامل أسفلها — نظيف وكلاسيكي ومتوافق مع ATS.',
    color: '#0f4c75',
    component: ATSElegantTemplate,
    atsScore: 99,
  },
  {
    id: 'classicserif',
    name: 'Classic Serif',   arabicName: 'كلاسيك سيريف',
    desc: 'Two-column layout with a subtle sidebar: contact & skills on the left, experience on the right.',
    arabicDesc: 'تصميم بعمودين: معلومات التواصل والمهارات على الجانب، والخبرة في المحتوى الرئيسي.',
    color: '#1e3a5f',
    component: ClassicSerifTemplate,
    atsScore: null,
  },
  {
    id: 'atlanticblue',
    name: 'Atlantic Blue',   arabicName: 'أتلانتيك بلو',
    desc: 'Bold dark-blue sidebar with white text, clean white right section for experience.',
    arabicDesc: 'شريط جانبي داكن أزرق بنص أبيض، وقسم أبيض نظيف للخبرة.',
    color: '#1e3d6e',
    component: AtlanticBlueTemplate,
    atsScore: null,
  },
  {
    id: 'mercuryflow',
    name: 'Mercury Flow',    arabicName: 'ميركوري فلو',
    desc: 'Colored header with avatar initials, accent-colored contact strip, accent vertical bars on sections.',
    arabicDesc: 'هيدر ملون مع أحرف الاسم الأولى، شريط تواصل، وأقسام بشريط لوني جانبي.',
    color: '#2a7d6e',
    component: MercuryFlowTemplate,
    atsScore: null,
  },
  {
    id: 'editorialrule',
    name: 'Editorial Rule',  arabicName: 'إديتوريال رول',
    desc: 'Large editorial name header, ruled section dividers, two-column bottom grid with dot ratings.',
    arabicDesc: 'اسم بارز بحجم كبير، فواصل أقسام بخطوط، وشبكة سفلية بعمودين مع تقييمات بالنقاط.',
    color: '#2c3e50',
    component: EditorialRuleTemplate,
    atsScore: null,
  },
  {
    id: 'sidebarlight',
    name: 'Sidebar Light',   arabicName: 'شريط جانبي فاتح',
    desc: 'Light grey sidebar with photo, dot-rated skills and education, clean white main column.',
    arabicDesc: 'شريط جانبي فاتح مع صورة، مهارات بتقييم نقطي، وعمود رئيسي أبيض نظيف.',
    color: '#3d6b8e',
    component: SidebarLightTemplate,
    atsScore: null,
  },
  {
    id: 'tealpro',
    name: 'Teal Pro',        arabicName: 'تيل برو',
    desc: 'Italic script name in teal, centered contact strip, skill pills and language dots.',
    arabicDesc: 'اسم مائل بلون تيل، شريط تواصل مركزي، بطاقات مهارات ونقاط اللغات.',
    color: '#2a9d8f',
    component: TealProTemplate,
    atsScore: null,
  },
  {
    id: 'roseelegant',
    name: 'Rose Elegant',    arabicName: 'روز إيليغانت',
    desc: 'Rose-pink accented header with photo, pill-style contact info and elegant section dividers.',
    arabicDesc: 'هيدر بلون وردي أنيق مع صورة، معلومات تواصل بشكل بيضاوي وفواصل أقسام أنيقة.',
    color: '#c0395e',
    component: RoseElegantTemplate,
    atsScore: null,
  },
  {
    id: 'darkheader',
    name: 'Dark Header',     arabicName: 'هيدر داكن',
    desc: 'Bold dark purple full-width header, two-column body with dot-rated sidebar and clean main area.',
    arabicDesc: 'هيدر بنفسجي داكن كامل العرض، وجسم بعمودين مع شريط جانبي بتقييم نقطي.',
    color: '#4a1f6e',
    component: DarkHeaderTemplate,
    atsScore: null,
  },
  {
    id: 'arabicpro',
    name: 'Arabic Pro',          arabicName: 'عربي احترافي',
    desc: 'Full-width dark teal header with overlapping circular photo, RTL two-column layout — dark sidebar with skill/language bars and teal badge section headings.',
    arabicDesc: 'هيدر زمردي داكن بصورة دائرية تتداخل معه، تخطيط بعمودين RTL — شريط جانبي داكن بأشرطة المهارات واللغات وعناوين بطاقات زمردية.',
    color: '#2a7f8a',
    component: ArabicProTemplate,
    atsScore: null,
  },
  {
    id: 'arabictealsidebar',
    name: 'Arabic Teal Sidebar', arabicName: 'شريط زمردي عربي',
    desc: 'Dark teal right sidebar with photo, contact, skills & languages. White main area with large bold name and teal-underlined section headings.',
    arabicDesc: 'شريط جانبي زمردي داكن بالصورة والتواصل والمهارات واللغات. المحتوى الرئيسي أبيض مع اسم كبير وعناوين أقسام مسطّرة.',
    color: '#2a7f8a',
    component: ArabicTealSidebarTemplate,
    atsScore: null,
  },
  {
    id: 'arabicslatesidebar',
    name: 'Arabic Slate Sidebar', arabicName: 'شريط كحلي عربي',
    desc: 'Deep navy gradient right sidebar with card-style section labels. Light name header bar and decorative line-style section headings in main.',
    arabicDesc: 'شريط جانبي كحلي بتدرج وعناوين داخل بطاقات. هيدر فاتح للاسم وعناوين أقسام بنمط السطر في المحتوى الرئيسي.',
    color: '#1f3c5c',
    component: ArabicSlateSidebarTemplate,
    atsScore: null,
  },
  {
    id: 'arabicnavy',
    name: 'Arabic Navy',     arabicName: 'نيفي عربي',
    desc: 'Dark navy sidebar on the right with white main content — bold RTL Arabic design.',
    arabicDesc: 'شريط جانبي كحلي داكن على اليمين مع محتوى أبيض — تصميم عربي RTL احترافي.',
    color: '#1a2744',
    component: ArabicNavyTemplate,
    atsScore: null,
  },
  {
    id: 'arabicmodern',
    name: 'Arabic Modern',   arabicName: 'عصري عربي',
    desc: 'Teal branded header with centered photo and name, clean single-column RTL layout.',
    arabicDesc: 'هيدر بلون الزمرد مع صورة واسم في المنتصف، تخطيط RTL أحادي العمود.',
    color: '#2a7d6e',
    component: ArabicModernTemplate,
    atsScore: null,
  },
  {
    id: 'arabicelite',
    name: 'Arabic Elite',    arabicName: 'النخبة العربي',
    desc: 'Dark navy sidebar with circular photo, star-rated skills, circular language gauges, and icon-grid interests. RTL two-column layout.',
    arabicDesc: 'شريط جانبي داكن مع صورة دائرية، تقييم المهارات بالنجوم، مقاييس اللغات الدائرية، وشبكة أيقونات الاهتمامات. تخطيط بعمودين RTL.',
    color: '#1f7a8a',
    component: ArabicEliteTemplate,
    previewData: arabicSampleData,
    previewIsRTL: true,
    atsScore: null,
  },
  {
    id: 'arabiccard',
    name: 'Arabic Card',     arabicName: 'بطاقة عربية',
    desc: 'Light gray sidebar on right with teal card-style section headers, two-column RTL.',
    arabicDesc: 'شريط جانبي فاتح على اليمين مع عناوين بطاقات زمردية، تخطيط بعمودين RTL.',
    color: '#2d6a8a',
    component: ArabicCardTemplate,
    atsScore: null,
  },
  {
    id: 'arabicwave',
    name: 'Arabic Wave',     arabicName: 'موجة عربية',
    desc: 'Dark navy right sidebar with circular photo, teal contact banner, star skills, circular language gauges, and wave-line section separators.',
    arabicDesc: 'شريط جانبي كحلي داكن مع صورة دائرية، بانر تواصل زمردي، تقييم المهارات بنجوم، مقاييس اللغات الدائرية، وفواصل أقسام بخط موجي.',
    color: '#2a8a96',
    component: ArabicWaveTemplate,
    previewData: arabicSampleData,
    previewIsRTL: true,
    atsScore: null,
  },
  {
    id: 'arabiczafir',
    name: 'Arabic Zafir',    arabicName: 'الزفير العربي',
    desc: 'Rich dark plum header with a centered photo, copper-gold accents, diamond dividers, and a deep gradient sidebar.',
    arabicDesc: 'هيدر بنفسجي داكن فاخر مع صورة مركزية، لكنات نحاسية ذهبية، فواصل ماسية، وشريط جانبي متدرج عميق.',
    color: '#c07840',
    component: ArabicZafirTemplate,
    previewData: arabicSampleData,
    previewIsRTL: true,
    atsScore: null,
  },
  {
    id: 'englishapex',
    name: 'English Apex',    arabicName: 'أبيكس الإنجليزي',
    desc: 'Bold dark navy sidebar with name and monogram inside, indigo accent, segmented skill bars, and a clean white main area.',
    arabicDesc: 'شريط جانبي كحلي داكن مع الاسم والحرف الأول داخله، لكنة نيلية، أشرطة مهارات مقسمة، ومنطقة رئيسية بيضاء نظيفة.',
    color: '#4f46e5',
    component: EnglishApexTemplate,
    previewData: sampleData,
    previewIsRTL: false,
    atsScore: null,
  },
  {
    id: 'arabicluxe',
    name: 'Arabic Luxe',     arabicName: 'الفاخر العربي',
    desc: 'Premium dark navy sidebar with gold diamond-skill bars, circular language gauges, and gradient gold accents throughout.',
    arabicDesc: 'شريط جانبي كحلي فاخر مع أشرطة مهارات ماسية ذهبية، مقاييس لغات دائرية، وتدرجات ذهبية راقية.',
    color: '#b8892a',
    component: ArabicLuxeTemplate,
    previewData: arabicSampleData,
    previewIsRTL: true,
    atsScore: null,
  },
  {
    id: 'englishhorizon',
    name: 'English Horizon',  arabicName: 'أفق إنجليزي',
    desc: 'Bold gradient teal header with split name typography, timeline-style experience, sidebar with progress-bar skills.',
    arabicDesc: 'هيدر متدرج زمردي جريء مع طباعة اسم مقسومة، تجربة بنمط التايملاين، وشريط جانبي بأشرطة تقدم المهارات.',
    color: '#0e5f6e',
    component: EnglishHorizonTemplate,
    previewData: sampleData,
    previewIsRTL: false,
    atsScore: null,
  },
  {
    id: 'prestige',
    name: 'Prestige',        arabicName: 'بريستيج',
    desc: 'Bold dark header with centered white name, elegant centered section dividers — striking and professional.',
    arabicDesc: 'هيدر داكن بالاسم الأبيض في المنتصف، فواصل أقسام أنيقة — مميز واحترافي.',
    color: '#1b2a4a',
    component: PrestigeTemplate,
    atsScore: null,
  },
  {
    id: 'velvet',
    name: 'Velvet',          arabicName: 'مخمل',
    desc: 'Full-width dark banner header with white uppercase name, colored section badges and accent pills.',
    arabicDesc: 'رأس بانر داكن بعرض كامل مع اسم أبيض بأحرف كبيرة، وشارات أقسام ملوّنة.',
    color: '#0f2942',
    component: VelvetTemplate,
    atsScore: null,
  },
  {
    id: 'aurora',
    name: 'Aurora',          arabicName: 'أورورا',
    desc: 'Extra-large bold name, gradient accent underline, left-bar section headings with timeline entries.',
    arabicDesc: 'اسم كبير جريء، خط تدرّج لوني أسفل الاسم، عناوين أقسام بشريط جانبي وإدخالات بأسلوب الجدول الزمني.',
    color: '#059669',
    component: AuroraTemplate,
    atsScore: null,
  },
  {
    id: 'arabicgem',
    name: 'Arabic Gem',      arabicName: 'جوهرة عربية',
    desc: 'Dark teal sidebar with geometric pattern, gold photo frame, skill bars and diamond section icons.',
    arabicDesc: 'سيدبار بلون teal داكن مع نقش هندسي، إطار صورة ذهبي، أشرطة مهارات وأيقونات ماسية للأقسام.',
    color: '#1a6464',
    component: ArabicGemTemplate,
    previewData: arabicSampleData,
    previewIsRTL: true,
    atsScore: null,
  },
];

const PREVIEW_SCALE = 0.28;
const PREVIEW_W = 794;
const PREVIEW_H = 1122;

const TemplateCard = ({ template, isSelected, isRTL, onSelect, onUse, isFree, isDark }) => {
  const Component = template.component;
  const previewTheme = { primaryColor: template.color };

  return (
    <div
      className={`group rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl ${
        isSelected ? 'border-primary-500 shadow-lg shadow-primary-100' : 'border-slate-200 hover:border-primary-300'
      }`}
      style={isDark ? { borderColor: isSelected ? '#6366f1' : '#334155' } : {}}
      onClick={() => onUse(template.id)}
    >
      {/* Live mini preview */}
      <div className="relative overflow-hidden bg-slate-100" style={{ height: PREVIEW_H * PREVIEW_SCALE }}>
        <div
          style={{
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: isRTL ? 'top right' : 'top left',
            width: PREVIEW_W,
            height: PREVIEW_H,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <Component data={template.previewData || sampleData} theme={previewTheme} isRTL={template.previewIsRTL ?? isRTL} />
        </div>

        {/* Free / Paid badge */}
        <div className="absolute top-3 right-3 z-10">
          {isFree ? (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white shadow">
              {isRTL ? 'مجاني' : 'Free'}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow flex items-center gap-1">
              ⭐ {isRTL ? 'Pro' : 'Pro'}
            </span>
          )}
        </div>


        {/* ATS badge */}
        {template.atsScore && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold z-10"
            style={{ background: '#16a34a', color: '#fff', boxShadow: '0 1px 6px rgba(22,163,74,0.4)' }}>
            ✓ ATS {template.atsScore}%
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="bg-white text-slate-700 font-semibold text-sm px-4 py-2 rounded-full shadow-md">
              {isSelected
                ? (isRTL ? '✓ محدد' : '✓ Selected')
                : (isRTL ? 'استخدام القالب' : 'Use Template')}
            </span>
          </div>
        </div>

        {isSelected && (
          <div
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
            style={{ backgroundColor: '#4f46e5' }}
          >
            ✓
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="p-4" style={{ background: isDark ? '#1e293b' : '#ffffff' }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.color }} />
            <h3 className="font-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
              {isRTL ? template.arabicName : template.name}
            </h3>
          </div>
          {isSelected && (
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              {isRTL ? 'نشط' : 'Active'}
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: isDark ? '#64748b' : '#64748b' }}>
          {isRTL ? template.arabicDesc : template.desc}
        </p>
      </div>
    </div>
  );
};

const TABS = [
  { id: 'all',     en: 'All Templates',  ar: 'جميع القوالب'   },
  { id: 'design',  en: 'Design',         ar: 'تصميمية'        },
  { id: 'ats',     en: 'ATS Compatible', ar: 'متوافقة مع ATS' },
];

const TemplatesPage = () => {
  const { selectedTemplate, setSelectedTemplate, previewTemplate } = useCV();
  const { isRTL } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const active = templates.find(t => t.id === selectedTemplate);

  const handleUse = (id) => {
    const tpl = templates.find(t => t.id === id);
    previewTemplate(id, tpl?.color);
    navigate('/builder?from=template');
  };

  const visibleTemplates = templates.filter(t => {
    if (activeTab === 'ats')    return t.atsScore !== null;
    if (activeTab === 'design') return t.atsScore === null;
    return true;
  });

  const pageBg = isDark ? '#0f172a' : '#f8fafc';
  const heroBg = isDark ? '#111827' : '#ffffff';
  const heroBorder = isDark ? '#1e293b' : '#f1f5f9';
  const headingColor = isDark ? '#f1f5f9' : '#0f172a';
  const subColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="min-h-screen" style={{ background: pageBg }}>
      {/* Hero */}
      <div className="py-12 px-4 border-b" style={{ background: heroBg, borderColor: heroBorder }}>
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <span>✦</span>
            <span>{isRTL ? 'معرض القوالب' : 'Template Gallery'}</span>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: headingColor }}>
            {isRTL ? 'اختر قالبك المثالي' : 'Choose Your Perfect Template'}
          </h1>
          <p className="max-w-xl mx-auto text-base" style={{ color: subColor }}>
            {isRTL
              ? 'اختر من بين قوالب تصميمية أنيقة أو قوالب مُحسَّنة لأنظمة ATS.'
              : 'Choose from elegant design templates or templates optimized for ATS systems.'}
          </p>
        </div>
      </div>

      {/* Filter Navbar */}
      <div className="border-b sticky top-0 z-20 shadow-sm" style={{ background: heroBg, borderColor: heroBorder }}>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-1 py-3 overflow-x-auto">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const count = tab.id === 'all'
                ? templates.length
                : tab.id === 'ats'
                ? templates.filter(t => t.atsScore !== null).length
                : templates.filter(t => t.atsScore === null).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                      : ''
                  }`}
                  style={!isActive ? { color: isDark ? '#94a3b8' : '#64748b' } : {}}
                >
                  {tab.id === 'ats' && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                      ✓
                    </span>
                  )}
                  {tab.id === 'design' && (
                    <span className={`text-xs ${isActive ? 'opacity-80' : ''}`} style={!isActive ? { color: isDark ? '#64748b' : '#94a3b8' } : {}}>✦</span>
                  )}
                  {isRTL ? tab.ar : tab.en}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${isActive ? 'bg-white/25 text-white' : ''}`}
                    style={!isActive ? { background: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' } : {}}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {/* ATS info pill */}
            {activeTab === 'design' && (
              <div className="mr-auto flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-700 font-medium">
                <span>⚠</span>
                <span>{isRTL ? 'هذه القوالب غير مُحسَّنة لـ ATS' : 'These templates are not ATS-optimized'}</span>
              </div>
            )}
            {activeTab === 'ats' && (
              <div className="mr-auto flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs text-green-700 font-medium">
                <span>✓</span>
                <span>{isRTL ? 'مُحسَّنة لأنظمة تتبع المتقدمين' : 'Optimized for applicant tracking systems'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              isRTL={isRTL}
              onSelect={setSelectedTemplate}
              onUse={handleUse}
              isFree={template.id === 'minimal'}
              isDark={isDark}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-sm" style={{ color: subColor }}>
            {isRTL
              ? `تم اختيار قالب "${active?.arabicName || ''}"`
              : `"${active?.name || ''}" template selected`}
          </p>
          <Link to="/builder" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base">
            {isRTL ? '→ ابدأ بناء سيرتك الذاتية' : 'Start Building Your Resume →'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;

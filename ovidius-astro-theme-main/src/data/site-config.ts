import heroAvatar from '../assets/images/avatar.jpg';
import heroBackground from '../assets/images/hero.webp';
import logoUrl from '../assets/images/logo.svg?url';
import defaultSocial from '../assets/images/ovidius-preview.jpg';
import type { SiteConfig } from '../types';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

const siteConfig: SiteConfig = {
    logo: {
        src: '',
        alt: '상인 - Tech PM'
    },
    title: 'Sanginn.dev | AI & Product Management',
    description: 'Astro.js and Tailwind CSS theme for blogging by justgoodui.com',
    image: {
        src: defaultSocial,
        alt: 'Ovidius - Astro.js and Tailwind CSS theme'
    },
    primaryNavLinks: [
        {
            text: 'Home',
            href: `${base}/`
        },
        {
            text: 'Blog',
            href: `${base}/blog`
        },
        {
            text: 'About',
            href: `${base}/about`
        },
        {
            text: 'Contact',
            href: `${base}/contact`
        }
    ],
    secondaryNavLinks: [
        {
            text: 'About',
            href: `${base}/about`
        },
        {
            text: 'Contact',
            href: `${base}/contact`
        }
    ],
    socialLinks: [
        {
            text: 'Go to GitHub repo',
            href: 'https://github.com/Merchantlee99',
            icon: 'github'
        },
        {
            text: 'Follow on Instagram',
            href: 'https://www.instagram.com/leesangin_n/',
            icon: 'instagram'
        },
        {
            text: 'Follow on LinkedIn',
            href: 'https://www.linkedin.com/in/%EC%83%81%EC%9D%B8-%EC%9D%B4-aa26a6354/',
            icon: 'linkedin'
        },
        {
            text: 'Send Email',
            href: 'mailto:f374800890@gmail.com',
            icon: 'mail'
        }
    ],
    hero: {
        title: '안녕하세요!',
        text: '저는 IT와 디자인 외에도, 세상을 호기심으로 가득 바라보는 이상인이라고 합니다, 만나서 반가워요 :)',
        avatar: {
            src: heroAvatar,
            alt: 'Justin Case'
        },
        backgroundImage: {
            src: heroBackground
        }
    },
    subscribe: {
        enabled: false,
        title: 'Subscribe to Ovidius Newsletter',
        text: 'One update per week. All the latest news directly in your inbox.',
        form: {
            action: 'https://justgoodthemes.us3.list-manage.com/subscribe/post?u=78f1bab16028354caeb23aecd&amp;id=4a7330d117&amp;f_id=005c48e2f0',
            emailFieldName: 'EMAIL',
            honeypotFieldName: 'b_78f1bab16028354caeb23aecd_4a7330d117'
        }
    },
    postsPerPage: 5
};

export default siteConfig;

'use client';

import {
    WrenchIcon,
    HomeIcon,
    DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    { name: 'Start', href: '/dashboard', icon: HomeIcon },
    {
        name: 'Data Contracts',
        href: '/dashboard',
        icon: DocumentDuplicateIcon,
    },
    { name: 'Settings', href: '/dashboard', icon: WrenchIcon },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-lime-100 hover:text-green-600 md:flex-none md:justify-start md:p-2 md:px-3',
                            {
                                'bg-lime-100 text-green-600': pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}

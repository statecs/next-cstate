import React from 'react';
import config from '@/utils/config';
import {fetchEditorialPage, fetchCollectionNavigation, fetchWritingNavigation} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';
import ProjectsTabs from './ProjectsTabs';

const ProjectPage = async () => {
  const [projectLinks, writingLinks] = await Promise.all([
    fetchCollectionNavigation(),
    fetchWritingNavigation()
  ]);

  const projects: Post[] = projectLinks.map((link) => ({
    url: link.url,
    title: link.title,
    slug: link.url,
    image: link.image,
    description: link.description,
    date: link.date,
    isPublic: link.isPublic,
    category: link.category,
    published: link.published || 'Not specified',
  }));

  const writings: Post[] = writingLinks.map((link) => ({
    url: link.url,
    title: link.title,
    slug: link.url,
    image: link.image,
    description: link.description,
    date: link.date,
    isPublic: link.isPublic,
    isMembersOnly: link.isMembersOnly,
    category: link.category,
    published: link.published || 'Not specified',
  }));

    return <ProjectsTabs projects={projects} writings={writings} />;
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('projects') || {};
    return {
        ...config.seo,
        ...getEditorialSeo(page),
        title: 'Projects & Writing | Christopher State',
        description: 'Creative projects and written content exploring design, technology, and innovation'
    };
};

export const revalidate = 86400; // 24 hours

export default ProjectPage;

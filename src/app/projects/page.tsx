import React from 'react';
import config from '@/utils/config';
import {fetchEditorialPage, fetchCollectionNavigation, fetchAllCaseStudies} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';
import ProjectsTabs from './ProjectsTabs';
import {buildProjectIndex} from '@/utils/projectIndex';

const ProjectPage = async () => {
  const [projectLinks, caseStudies] = await Promise.all([
    fetchCollectionNavigation(),
    fetchAllCaseStudies(),
  ]);

  return <ProjectsTabs projects={buildProjectIndex(projectLinks, caseStudies)} />;
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('projects') || {};
    return {
        ...config.seo,
        ...getEditorialSeo(page),
        title: 'Projects | Christopher State',
        description: 'Selected design and engineering work'
    };
};

export const revalidate = 86400; // 24 hours

export default ProjectPage;

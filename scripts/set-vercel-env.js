#!/usr/bin/env node

/**
 * Script to manually set environment variables for a Vercel project
 * Usage: node set-vercel-env.js <project-name>
 */

const axios = require('axios');

// Configuration
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || 'YOUR_VERCEL_TOKEN_HERE';
const TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_Ij7An3GM3EBBwy4VQXaHawJq';

const projectName = process.argv[2];

if (!projectName) {
  console.error('Usage: node set-vercel-env.js <project-name>');
  process.exit(1);
}

// Environment variables to set
const envVars = [
  {
    key: 'NEXT_PUBLIC_GOOGLE_PLACES_API_KEY',
    value: 'AIzaSyCF--irB1Ja8RLSDoA49sxB1LtZG0YcCPg',
    type: 'encrypted',
    target: ['production', 'preview', 'development'],
  },
  {
    key: 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
    value: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Test key
    type: 'encrypted',
    target: ['production', 'preview', 'development'],
  },
  // Add more variables as needed
];

async function setEnvironmentVariables() {
  const headers = {
    'Authorization': `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json',
  };

  for (const variable of envVars) {
    try {
      // Try without team ID first
      let url = `https://api.vercel.com/v10/projects/${projectName}/env`;
      
      console.log(`Setting ${variable.key}...`);
      
      try {
        await axios.post(url, variable, { headers });
        console.log(`✓ ${variable.key} set successfully`);
        continue;
      } catch (error) {
        if (error.response?.status === 403) {
          // Try with team ID
          url = `${url}?teamId=${TEAM_ID}`;
          await axios.post(url, variable, { headers });
          console.log(`✓ ${variable.key} set successfully (with team ID)`);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error(`✗ Failed to set ${variable.key}:`, error.response?.data || error.message);
    }
  }
}

setEnvironmentVariables().catch(console.error);
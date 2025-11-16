export const stageRequirements = {
  discovery: {
    allowedPhases: [2],
    actionWhitelist: ['survey_tile'],
    milestones: [
      {
        id: 'surveyed_tiles',
        label: 'Survey initial terrain (5 tiles)',
        metric: 'surveyedTiles',
        target: 5,
      },
      {
        id: 'reports_generated',
        label: 'Generate at least one analytics report',
        metric: 'reportsGenerated',
        target: 1,
      },
    ],
  },
  design: {
    allowedPhases: [1],
    actionWhitelist: [],
    milestones: [
      {
        id: 'assemblies_saved',
        label: 'Draft assemblies in the station (save 1 plan)',
        metric: 'assembliesSaved',
        target: 1,
      },
    ],
  },
  deployment: {
    allowedPhases: [0, 1, 2],
    actionWhitelist: null,
    milestones: [
      {
        id: 'ccc_deployed',
        label: 'Deploy a Computing Control Communications assembly',
        metric: 'cccDeployed',
        target: 1,
      },
      {
        id: 'station_hub_deployed',
        label: 'Deploy an Assembly Station assembly',
        metric: 'stationHubDeployed',
        target: 1,
      },
      {
        id: 'assemblies_deployed',
        label: 'Deploy at least one assembly to the terrain',
        metric: 'assembliesDeployed',
        target: 1,
      },
    ],
  },
};

import { stageRequirements } from '@/dict/stageRequirements.js';

const DEFAULT_STAGE = 'discovery';

function getStageKey(game) {
  const stages = game?.bioromizationStages || [];
  const index = game?.bioromizationStage ?? 0;
  return stages[index] || DEFAULT_STAGE;
}

function getStageConfig(stageKey) {
  return stageRequirements[stageKey] || stageRequirements[DEFAULT_STAGE];
}

function getAllowedPhases(stageKey) {
  const config = getStageConfig(stageKey);
  return Array.isArray(config?.allowedPhases) && config.allowedPhases.length
    ? config.allowedPhases
    : [0, 1, 2];
}

function getActionWhitelist(stageKey) {
  return getStageConfig(stageKey)?.actionWhitelist ?? null;
}

function isActionAllowed(stageKey, actionKey) {
  const whitelist = getActionWhitelist(stageKey);
  if (whitelist === null) {
    return true;
  }
  if (!Array.isArray(whitelist) || whitelist.length === 0) {
    return false;
  }
  return whitelist.includes(actionKey);
}

function buildStageContext(game, map) {
  const stats = game?.stats?.value || game?.stats || {};
  const tiles = Array.isArray(map?.tiles) ? map.tiles : map?.tiles?.value || [];

  const surveyedTiles = tiles.flat().reduce((count, tile) => {
    const measured = tile?.topography?.elevation?.measured?.value;
    return Number.isFinite(measured) ? count + 1 : count;
  }, 0);

  return {
    surveyedTiles,
    reportsGenerated: stats.reportsGenerated ?? 0,
    assembliesSaved: stats.assembliesSaved ?? 0,
    assembliesDeployed: stats.assembliesDeployed ?? 0,
    cccDeployed: stats.cccDeployed ? 1 : 0,
    stationHubDeployed: stats.stationHubDeployed ? 1 : 0,
  };
}

function evaluateStageMilestones(stageKey, context) {
  const config = getStageConfig(stageKey);
  const milestones = Array.isArray(config?.milestones) ? config.milestones : [];
  return milestones.map((milestone) => {
    const current = Number(context[milestone.metric] ?? 0);
    return {
      id: milestone.id,
      label: milestone.label,
      target: milestone.target,
      current,
      completed: Number(current) >= Number(milestone.target ?? 0),
    };
  });
}

function canAdvanceStage(stageKey, context) {
  const milestones = evaluateStageMilestones(stageKey, context);
  if (!milestones.length) {
    return true;
  }
  return milestones.every((milestone) => milestone.completed);
}

export {
  getStageKey,
  getStageConfig,
  getAllowedPhases,
  getActionWhitelist,
  isActionAllowed,
  buildStageContext,
  evaluateStageMilestones,
  canAdvanceStage,
};

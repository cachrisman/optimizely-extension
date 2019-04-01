import axios from "axios";

let client = null;
let projectID = null;

export const initializeClient = (optimizelyApiToken, optimizelyProjectId) => {
  projectID = parseInt(optimizelyProjectId, 10);
  client = axios.create({
    baseURL: "https://api.optimizely.com/v2/",
    headers: {
      Authorization: `Bearer ${optimizelyApiToken}`
    }
  });
};

export const getProject = () => {
  return client.get(`/projects/${projectID}`).then(response => response.data);
};

export const getExperiment = id => {
  return client.get(`/experiments/${id}`).then(response => response.data);
};

export const getExperimentResults = id => {
  return client
    .get(`/experiments/${id}/results`)
    .then(response => response.data);
};

export const createExperiment = ({ key, variations, metrics, description }) => {
  return client
    .post(`/experiments`, {
      key,
      variations,
      metrics,
      description,
      project_id: projectID,
      type: "a/b"
    })
    .then(response => response.data);
};

export const startExperiment = id => {
  return client
    .patch(`/experiments/${id}?action=start`, {})
    .then(response => response.data);
};

export const pauseExperiment = id => {
  return client
    .patch(`/experiments/${id}?action=pause`, {})
    .then(response => response.data);
};

export const resumeExperiment = id => {
  return client
    .patch(`/experiments/${id}?action=resume`, {})
    .then(response => response.data);
};

export const deleteExperiment = id => {
  return client.delete(`/experiments/${id}`).then(response => response.data);
};

export const createEvent = ({ key, description }) => {
  return client
    .post(`/projects/${projectID}/custom_events`, {
      key,
      description,
      event_type: "custom",
      category: "other"
    })
    .then(response => response.data);
};

export const deleteEvent = id => {
  return client
    .delete(`/projects/${projectID}/custom_events/${id}`)
    .then(response => response.data);
};

export const getEvent = id => {
  return client.get(`/events/${id}`).then(response => response.data);
};

export const getResultsUrl = (campainId, experimentId) => {
  return `https://app.optimizely.com/v2/projects/${projectID}/results/${campainId}/experiments/${experimentId}`;
};

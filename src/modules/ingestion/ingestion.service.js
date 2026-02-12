import RequestLog from "../../database/models/RequestLog.js";
import { processThreat } from "../threat/threat.engine.js";

export const saveLog = async (projectId, logData) => {
  const log = await RequestLog.create({
    ...logData,
    ProjectId: projectId
  });

  // Run threat detection
  await processThreat(projectId, logData);

  return log;
};

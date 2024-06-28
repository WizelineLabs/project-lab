// Import the Google Cloud client library using default credentials
import { singleton } from "./singleton.server";
import { BigQuery } from "@google-cloud/bigquery";

const client = singleton("bigquery", () => new BigQuery());

export async function findProfileData(email: string) {
  // Queries the U.S. given names dataset for the state of Texas.

  const query = `SELECT contact__wizeos_profile_id, contact__employee_number, contact__email,
      contact__first_name, contact__preferred_name, contact__last_name,
      contact__photo__url,
      contact__isbillable,
      contact__location, contact__country,
      contact__status, contact__department, contact__business_unit,
      contact__employee_status,
      contact__wizeos__level, contact__title, contact__role
    FROM \`wizelake-prod.wizelabs_wzlk.contact\`
    WHERE contact__email = @email
    LIMIT 10`;

  // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
  const options = {
    query: query,
    // Location must match that of the dataset(s) referenced in the query.
    location: "US",
    params: { email },
  };

  // Wait for the query to finish
  const [rows] = await client.query(options);

  // Print the results
  if (rows.length > 0) {
    return rows[0];
  } else {
    throw new Error(`Profile ${email} not found on lake`);
  }
}

export async function getActiveProfiles() {
  const query = `SELECT contact__wizeos_profile_id, contact__employee_number, contact__email,
    contact__first_name, contact__preferred_name, contact__last_name,
    contact__photo__url,
    contact__isbillable,
    contact__location, contact__country,
    contact__status, contact__department, contact__business_unit,
    contact__employee_status,
    contact__wizeos__level, contact__title, contact__role
  FROM \`wizelake-prod.wizelabs_wzlk.contact\`
  WHERE contact__employee_status != "Terminated" AND NOT contact__email IS NULL`;

  const options = {
    query: query,
    location: "US",
    params: {},
  };

  // Wait for the query to finish
  const [rows] = await client.query(options);

  // Print the results
  if (rows.length > 0) {
    return rows;
  } else {
    throw new Error("Profile not found on lake");
  }
}

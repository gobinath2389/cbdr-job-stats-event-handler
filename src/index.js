// AWS Lambda File
const db = require('./dbconfig');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });



async function insertData(data) {
  console.log(`Insert data for session_id ${data.session_id} data: ${JSON.stringify(data)}`)
  let query = `insert into "mandoJobs".tbl_job_stats (session_id, map_request_id,acquire_count,pre_dedup_count,post_dedup_count,publish_count,created_by,modified_by)
  values('${data.session_id}','${data.map_request_id}',${(data.acquire_count !== undefined && data.acquire_count !== '') ? data.acquire_count : null},${(data.pre_dedup_count !== undefined && data.pre_dedup_count !== '') ? data.pre_dedup_count : null},${(data.post_dedup_count !== undefined && data.post_dedup_count !== null) ? data.post_dedup_count : null},${(data.publish_count !== undefined && data.publish_count !== '') ? data.publish_count : null},'${process.env.DB_USER}','${process.env.DB_USER}') 
ON CONFLICT (session_id) 
DO 
   UPDATE SET acquire_count = ${(data.acquire_count === undefined || data.acquire_count === '') ? '"mandoJobs".tbl_job_stats.acquire_count' : 'EXCLUDED.acquire_count'},
   pre_dedup_count = ${(data.pre_dedup_count === undefined || data.pre_dedup_count === '') ? '"mandoJobs".tbl_job_stats.pre_dedup_count' : 'EXCLUDED.pre_dedup_count'},
   post_dedup_count = ${(data.acquire_count !== undefined || data.acquire_count !== '') ? null : 'EXCLUDED.post_dedup_count'}, 
   publish_count = ${(data.publish_count === undefined || data.publish_count === '') ? '"mandoJobs".tbl_job_stats.post_dedup_count' : 'EXCLUDED.publish_count'},
   modified_by= '${process.env.DB_USER}'`;
  console.log(query)
  let resp = await db.query(query);
  
  return resp;
}

async function saveJobMetrics(msg) {
  await insertData(msg);
}

exports.handler = async (event, context) => {
  try {
    for (const msg of event.Records) {
      await saveJobMetrics(JSON.parse(msg.body));
    }
  } catch (e) {
    console.error(`save job metrics error:`, e);
    return false;
  }
  console.log(`Job Stats handler is executed successfully.`);
  return true;
};

//for local test
/*insertData({
  session_id: 'e6de44f9a498e5180baa',
  map_request_id: '50000',
  acquire_count: 18000,
  pre_dedup_count: 17000
  //post_dedup_count: 16000
})*/
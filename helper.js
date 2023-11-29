
const fs = require('fs').promises
const filePath = 'test/testcheck.json'
const helperFnAdd = async(name = "John Doe", label="stds.schema-org.CreativeWork" )=>{

    const jsonFile = `
{
    "alg": "es256",
    "private_key": "es256_private.key",
    "sign_cert": "es256_certs.pem",
    "ta_url": "http://timestamp.digicert.com",
    
    "claim_generator": "TestApp",
    "title": "My Title",
    "assertions": [
        {
            "label": "${label}",
            "data": {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                "author": [
                    {
                        "@type": "Person",
                        "name": "${name}"
                    }
                ]
            }
        },
        {
            "label": "c2pa.actions",
            "data": {
                "actions": [
                    {
                        "action": "c2pa.opened"
                    }
                ]
            }
        }
    ]
}`
  try {
    await fs.writeFile(filePath, jsonFile)
  } catch (error) {
    console.log("Error : ", error)
  }


} 




const helperFnUpdate = async(name = "John Doe", label="stds.schema-org.CreativeWork", actions = false )=>{
    let actionsLocal = actions ? actions: 'opened'
    const jsonFile = `
{
    "alg": "es256",
    "private_key": "es256_private.key",
    "sign_cert": "es256_certs.pem",
    "ta_url": "http://timestamp.digicert.com",
    
    "claim_generator": "TestApp",
    "title": "My Title",
    "assertions": [
        {
            "label": "${label}",
            "data": {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                "author": [
                    {
                        "@type": "Person",
                        "name": "${name}"
                    }
                ]
            }
        },
        {
            "label": "c2pa.actions",
            "data": {
                "actions": [
                    {
                        "action": "c2pa.${actionsLocal}"
                    }
                ]
            }
        }
    ]
}`
    try {
    await fs.writeFile(filePath, jsonFile)
  } catch (error) {
    console.log("Error : ", error)
  }


} 
module.exports = {
    helperFnAdd,
    helperFnUpdate
}

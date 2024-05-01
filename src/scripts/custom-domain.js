const regionalDataUrlMapping = {
    "eastus.data.": "-data-us",
    "westeurope.data.": "-data-eu",
    "canadacentral.data.": "-data-ca",
    "brazilsouth.data.": "-data-br",
    "japanwest.data.": "-data-jp",
    "australiasoutheast.data.": "-data-au"
};

// This function is used to transform a registry URL to a corresponding custom domain URL.
// The function takes three parameters:
// - inputUrlString: The URL to transform
// - customDomainUrlString: The custom domain URL the hostname of which to use as basis for the transformation
// - keepCustomDomainUrl: A boolean indicating whether to keep the other URL parts like path, query parameters and hash of the custom domain URL instead of the input URL
export const transformUrlToCustomDomain = (inputUrlString, customDomainUrlString, keepCustomDomainUrl) => {
    let inputUrl = new URL(inputUrlString)
    let inputUrlHostname = inputUrl.hostname.toString().toLowerCase();
    let customDomainUrl = new URL(customDomainUrlString)
    let customDomainUrlHostname = customDomainUrl.hostname.toString().toLowerCase();
    // If the input URL already has the same hostname as the custom domain URL, return the input URL
    if (inputUrlHostname === customDomainUrlHostname) {
        return inputUrlString;
    }
    let resultUrl = inputUrl;
    // If keepCustomDomainUrl is true, the other URL parts like path, query parameters and hash of the custom domain URL to the result URL
    if (keepCustomDomainUrl) {
        resultUrl = customDomainUrl;
        resultUrl.hostname = inputUrlHostname;
    }
    // If the input URL is a data URL
    if (inputUrlHostname.indexOf('.data.') > 0) {
        // If the custom domain URL is also a data URL, simply take-over the hostname of the custom domain URL
        if (customDomainUrlHostname.indexOf('data') > 0) {
            resultUrl.hostname = customDomainUrlHostname;
        }
        // Otherwise, if the custom domain URL is not a data URL, transform the hostname of the input URL to match the custom domain URL based on the regionalDataUrlMapping
        else {
            for (let [key, value] of Object.entries(regionalDataUrlMapping)) {
                if (resultUrl.hostname.indexOf(key) > 0) {
                    let parts = customDomainUrlHostname.split('.');
                    parts[0] += value;
                    resultUrl.hostname = parts.join('.');
                    break;
                }
            }
        }
    }
    // Otherwise, if the input URL is not a data URL
    else {
        let customDomainUrlHostnameWithoutDataString = customDomainUrlHostname
        // If the custom domain URL is a data URL, remove the regional data part from the hostname
        if (customDomainUrlHostnameWithoutDataString.indexOf('data') > 0) {
            for (let value of Object.values(regionalDataUrlMapping)) {
                customDomainUrlHostnameWithoutDataString = customDomainUrlHostnameWithoutDataString.replace(value, '');
            }
        }
        // Take-over the (preprocessed) hostname of the custom domain URL
        resultUrl.hostname = customDomainUrlHostnameWithoutDataString;
    }
    return resultUrl.toString();
};

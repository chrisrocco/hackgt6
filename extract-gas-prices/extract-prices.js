const Vision = require('@google-cloud/vision');
const { PubSub } = require('@google-cloud/pubsub');
const { getPolygonCentroid, isNumeric } = require('./helpers')

/**
 * Triggered from a upload to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const extractPrices = async (event, context) => {

    // This is where we will publish extracted image data.
    const outputTopic = 'projects/personal-178603/topics/hackgt-gas-price-image-data'
    const pubsub = new PubSub();
    const vision = new Vision.ImageAnnotatorClient();

    // Run vision API on new image file.
    const [result] = await vision.textDetection(event.mediaLink);
    const detections = result.textAnnotations;

    // Enriching the results of the vision API.
    const objects = detections.map(detection => {
        const desc = detection.description.toLowerCase()
        return {
            type: isNumeric(desc) ? 'price' : 'fuel-type',
            text: desc,
            centroid: getPolygonCentroid(detection.boundingPoly.vertices)
        }
    })

    /** Publish the extracted data. */
    const topic = pubsub.topic(outputTopic);
    const messageObject = {
        data: objects
    }
    const messageBuffer = Buffer.from(JSON.stringify(messageObject), 'utf8');
    topic.publish(messageBuffer);
}

module.exports = extractPrices
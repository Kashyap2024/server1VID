const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse incoming HTML data
app.use(bodyParser.text({ type: 'text/html' }));

// Route to handle POST requests
app.post('/api/html', async (req, res) => {
    try {
        const videoPageContent = req.body;

        // Initialize variables
        let fileLink = '';
        let baseUrl = '';
        let newPattern = '';
        let langValue = '';
        let valueBeforeM3u8 = '';
        let dataValue = '';
        let srvValue = '';
        let fileIdValue = '';
        let cValue = '';
        let asnValue = '';
        let spValue = '';
        let pallValue = '';
        let cookieFileIdValue = '';
        let lanmatchvaluepipe = '';

        // All Regular Expressions
        const baseUrlRegular = /\|([^|]+)\|sources\|/;
        const draftbaseUrlRegular = /\|([^|]*cdn[^|]*)\|/;
        const newPatternRegular = /\|kind(?:\|[^|]*)?\|(\d{5})\|(\d{2})\|/;
        const langValueRegular = /\|master\|([^|]+)\|/;
        const valueBeforeM3u8Regular = /\|129600\|([^|]+(?:\|[^|]+)*)\|m3u8\|/;
        const dataValueRegular = /\|data\|([^|]+)\|/;
        const srvValueRegular = /\|srv\|([^|]+)\|/;
        const fileIdRegular = /file_id',\s*'([^']+)/;
        const cValueRegular = /ab:\[{[^]*?([0-9]+\.[0-9])&/;
        const asnValueRegular = /\|text\|([^|]+)\|/;
        const spValueRegular = /\|([^|]+)\|sp\|/;
        const pallValueRegular = /\|file\|([^|]+)\|/;
        const cookieValueRegular = /\$.cookie\('file_id',\s*'([^']+)/;

        // Processing the HTML content with regex matches
        const baseMatch = videoPageContent.match(baseUrlRegular);
        const draftbaseMatch = videoPageContent.match(draftbaseUrlRegular);
        const newPatternMatch = videoPageContent.match(newPatternRegular);
        const langMatch = videoPageContent.match(langValueRegular);
        const m3u8Match = videoPageContent.match(valueBeforeM3u8Regular);
        const dataMatch = videoPageContent.match(dataValueRegular);
        const srvMatch = videoPageContent.match(srvValueRegular);
        const fileIdMatch = videoPageContent.match(fileIdRegular);
        const cMatch = videoPageContent.match(cValueRegular);
        const asnMatch = videoPageContent.match(asnValueRegular);
        const spMatch = videoPageContent.match(spValueRegular);
        const pallMatch = videoPageContent.match(pallValueRegular);
        const cookieMatch = videoPageContent.match(cookieValueRegular);

        if (baseMatch) {
            const reversedSegments = `${baseMatch[1]}`;
            const draft2baseurl = `${draftbaseMatch[1]}`;
            baseUrl = `${reversedSegments}.${draft2baseurl}.com`;
        }

        if (newPatternMatch) {
            const reversebefore = `${newPatternMatch[1]}|${newPatternMatch[2]}|hls2`;
            newPattern = reversebefore.split('|').reverse().join('/');
        }

        if (langMatch) {
            lanmatchvaluepipe = langMatch[1];
            langValue = `${lanmatchvaluepipe}`;
        }

        if (m3u8Match) {
            const valueBeforeM3u8pipe = m3u8Match[1];
            const parts = valueBeforeM3u8pipe.split('|');
            
            if (parts.length === 1) {
                valueBeforeM3u8 = parts[0];
            } else if (parts.length === 2) {
                // Check if parts[1] is a number
                if (!isNaN(parts[1])) {
                    valueBeforeM3u8 = parts[0];
                } else {
                    valueBeforeM3u8 = `${parts[1]}-${parts[0]}`;
                }
            } else {
                console.error('Unexpected parts length for m3u8 match.');
            }
            console.log(valueBeforeM3u8);
        } else {
            console.error('m3u8 match not found.');
        }


        if (dataMatch) {
            dataValue = dataMatch[1];
        }

        if (srvMatch) {
            srvValue = srvMatch[1];
        }

        if (fileIdMatch) {
            fileIdValue = fileIdMatch[1];
        }

        if (cMatch) {
            const fullCValue = cMatch[0];
            cValue = fullCValue;
        }

        if (asnMatch) {
            asnValue = asnMatch[1];
        }

        if (spMatch) {
            spValue = spMatch[1];
        }

        if (pallMatch) {
            pallValue = pallMatch[1];
        }

        if (cookieMatch) {
            cookieFileIdValue = cookieMatch[1];
        }

        // Construct the m3u8 link
        const makeurl = `https://${baseUrl}/${newPattern}/${langValue}/master.m3u8?t=${valueBeforeM3u8}&s=${dataValue}&e=${srvValue}&f=${fileIdValue}&srv=${pallValue}&i=0.4&sp=${spValue}&p1=${pallValue}&p2=${pallValue}`;
        fileLink = makeurl;
        console.log('Constructed m3u8 link:', fileLink);

        // Fetch the m3u8 link
        const response = await fetch(fileLink);
        console.log('Fetch response status:', response.status);
        return res.json({
            type: 'embed',
            source: fileLink,
            message: 'm3u8 link generated successfully'
        });

        // if (response.ok) {
        // } else {
        //     console.error('Failed to fetch m3u8 link, status:', response.status);
        //     return res.status(response.status).json({ error: 'Failed to fetch m3u8 link' });
        // }
    } catch (error) {
        console.error('Error during processing:', error.message);
        return res.status(500).json({ error: 'Error during processing: ' + error.message });
    }
});

// Start the server
const PORT = 4200;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

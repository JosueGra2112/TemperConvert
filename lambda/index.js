const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        const messages = {
            'es-MX': 'Hola. Este es el conversor de grados. Puedes pedirme que convierta grados centígrados a Fahrenheit.',
            'en-US': 'Hello. This is the degree converter. You can ask me to convert Fahrenheit to Celsius.'
        };
        const speakOutput = messages[locale] || messages['en-US'];

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ConvertTemperatureIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertTemperature';
    },
    handle(handlerInput) {
        const temperatureSlot = handlerInput.requestEnvelope.request.intent.slots.temperature;
        const unitSlot = handlerInput.requestEnvelope.request.intent.slots.unit;

        if (!temperatureSlot || !unitSlot || !temperatureSlot.value || !unitSlot.value) {
            return handlerInput.responseBuilder
                .speak('Lo siento, no pude entender la temperatura o la unidad. Por favor, inténtalo de nuevo.')
                .getResponse();
        }

        const temperature = parseFloat(temperatureSlot.value);
        const unit = unitSlot.value.toLowerCase();
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        let convertedTemperature;
        let response;

        if (locale === 'es-MX' && (unit === 'centígrados' || unit === 'celsius')) {
            convertedTemperature = (temperature * 9/5) + 32;
            response = `${temperature} grados centígrados son ${convertedTemperature.toFixed(2)} grados Fahrenheit.`;
        } else if (locale === 'en-US' && (unit === 'fahrenheit' || unit === 'farenheit')) {
            convertedTemperature = (temperature - 32) * 5/9;
            response = `${temperature} degrees Fahrenheit is ${convertedTemperature.toFixed(2)} degrees Celsius.`;
        } else if (locale === 'es-MX') {
            response = 'Lo siento, solo puedo convertir de grados centígrados a Fahrenheit.';
        } else {
            response = 'Sorry, I can only convert from Fahrenheit to Celsius.';
        }

        return handlerInput.responseBuilder
            .speak(response)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        const messages = {
            'es-MX': 'Puedes pedirme que convierta temperaturas entre grados centígrados y Fahrenheit. ¿Cómo te puedo ayudar?',
            'en-US': 'You can ask me to convert temperatures between Fahrenheit and Celsius. How can I help you?'
        };
        const speakOutput = messages[locale] || messages['en-US'];

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        const messages = {
            'es-MX': '¡Adiós!',
            'en-US': 'Goodbye!'
        };
        const speakOutput = messages[locale] || messages['en-US'];

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        const messages = {
            'es-MX': 'Lo siento, no sé sobre eso. Por favor, inténtalo de nuevo.',
            'en-US': 'Sorry, I don\'t know about that. Please try again.'
        };
        const speakOutput = messages[locale] || messages['en-US'];

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        const messages = {
            'es-MX': 'Lo siento, hubo un problema al hacer lo que pediste. Por favor, inténtalo de nuevo.',
            'en-US': 'Sorry, I had trouble doing what you asked. Please try again.'
        };
        const speakOutput = messages[locale] || messages['en-US'];
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertTemperatureIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('sample/conversor-de-temperatura/v1.2')
    .lambda();

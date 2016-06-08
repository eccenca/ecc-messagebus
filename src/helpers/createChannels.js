
import rxmq from '../index'

import SubjectType from './SubjectType'

//This getSubject Function does allow to overwrite the channel
const getSubjectPrivate = ({defaultChannel, subject}, channelName) => {
    const currentChannel = channelName || defaultChannel;
    return rxmq.channel(currentChannel).subject(subject);
};

//This getSubject Function does not allow to overwrite the channel
const getSubjectPublic = ({defaultChannel, subject}) => {
    return rxmq.channel(defaultChannel).subject(subject);
};

const createChannels = ({name: defaultChannel, subjects}) => {

    // Throw Error if no Channel Name is set
    if(!defaultChannel){
        throw new Error('')
    }

    // Storage for public and private channels
    const privateChannel = {};
    const publicChannel = {};

    // Iterate over all given subjects
    // Subjects are a map of name -> fn, where fn returns a string with the subject type (e.g. private)
    for (let subjName in subjects) {
        if(subjects.hasOwnProperty(subjName)){

            // get subject type
            const subjectType = subjects[subjName]();
            // prepend subjectType to subject name
            const subject = `${subjectType}.${subjName}`;

            const subjectDefinition = {
                subject,
                defaultChannel,
                // we want to prevent people from calling onNext and subscribe directly
                onNext() {
                    throw new Error(`Please do not ${defaultChannel}:${subject} onNext() directly`);
                },
                subscribe() {
                    throw new Error(`Please do not ${defaultChannel}:${subject} subscribe() directly`);
                },
            };

            // depending on the subjectType we want other getSubject Functions
            switch (subjectType) {
            case SubjectType.private():
                subjectDefinition.getSubject = getSubjectPrivate.bind(null, {defaultChannel, subject});
                privateChannel[subjName] = subjectDefinition;
                break;
            case SubjectType.public():
                subjectDefinition.getSubject = getSubjectPublic.bind(null, {defaultChannel, subject});
                publicChannel[subjName] = subjectDefinition;
                break;
            // and throw an error, if the Type is unknown
            default:
                throw new Error(`Unknown SubjectType ${subjectType}`);
            }

        }
    }

    const channel = rxmq.channel(defaultChannel);

    return {
        channel,
        privateChannel,
        publicChannel,
    };

};

export default createChannels;

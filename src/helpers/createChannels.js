
import rxmq from '../index'

import SubjectType from './SubjectType'

const getSubjectPrivate = ({defaultChannel, subject}, channelName) => {
    const currentChannel = channelName || defaultChannel;
    return rxmq.channel(currentChannel).subject(subject);
};

const getSubjectPublic = ({defaultChannel, subject}) => {
    return rxmq.channel(defaultChannel).subject(subject);
};

const createChannels = ({name: defaultChannel, subjects}) => {

    if(!defaultChannel){
        throw new Error('')
    }
    
    const privateChannel = {};
    const publicChannel = {};

    for (let subjName in subjects) {
        if(subjects.hasOwnProperty(subjName)){
            const subjectType = subjects[subjName]();
            const subject = `${subjectType}.${subjName}`;

            const subjectDefinition = {
                subject,
                defaultChannel,
                onNext() {
                    throw new Error(`Please do not ${defaultChannel}:${subject} onNext() directly`);
                },
                subscribe() {
                    throw new Error(`Please do not ${defaultChannel}:${subject} subscribe() directly`);
                },
            };

            switch (subjectType) {
            case SubjectType.private():
                subjectDefinition.getSubject = getSubjectPrivate.bind(null, {defaultChannel, subject});
                privateChannel[subjName] = subjectDefinition;
                break;
            case SubjectType.public():
                subjectDefinition.getSubject = getSubjectPublic.bind(null, {defaultChannel, subject});
                publicChannel[subjName] = subjectDefinition;
                break;
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

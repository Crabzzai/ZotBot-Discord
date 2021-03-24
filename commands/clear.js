// Module export
module.exports = () => {
    var moduleData = {};

    moduleData.name = 'clear';
    moduleData.description = 'Clear X amount of messages.';

    moduleData.options = [
        {
            name: 'number',
            description: 'The amount of messages to clear.',
            type: 4,
            required: true
        }
    ];

    moduleData.execute = (bot, dataStream, args) => {
        var respond = reqiure('../respond.js')(bot, dataStream);
        try {
            if (!dataStream.member.hasPermission('MANAGE_MESSAGES')) return respond.post({
                data: {
                    type: 4,
                    data: {
                        content: `You aren't allowed to do that!`
                    }
                }
            });

            if (args[0].value <= 0) return respond.post({
                data: {
                    type: 4,
                    data: {
                        content: `It's not possible to clear 0 or fewer messages.`
                    }
                }
            });

            dataStream.channel.bulkDelete(args[0].value).then((messages) => {
                respond.post({
                    data: {
                        type: 4,
                        data: {
                            content: `Cleared ${messages.size} messages for you! <3`
                        }
                    }
                });
            }).catch((err) => {
                console.error(err);
                respond.post({
                    data: {
                        type: 4,
                        data: {
                            content: `Something went wrong, please try again later!`
                        }
                    }
                });
            });
        } catch (err) {
            console.error(err);
            respond.post({
                data: {
                    type: 4,
                    data: {
                        content: `Something went wrong, please try again later!`
                    }
                }
            });
        }
    };

    return moduleData;
}
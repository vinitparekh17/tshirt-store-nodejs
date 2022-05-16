exports.home = async (req, res) => {
    try {
        await res.status(200).json({
            status: 200,
            greeting: "Hello from Home API"
        })
    } catch (error) {
        console.log(error);
    }
}

exports.homeDummy = async (req, res) => {
    try {
        await res.status(200).json({
            status: 200,
            greeting: "Hello from HomeDummy API"
        })
    } catch (error) {
        console.log(error);
    }
} 
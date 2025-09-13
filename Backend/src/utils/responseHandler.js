class ResponseHandler {
    success(res, message, data = null) {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    }

    error(res, message, error = null) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message,
            error: error?.message || error
        });
    }

    notFound(res, message) {
        return res.status(404).json({
            success: false,
            message
        });
    }

    badRequest(res, message) {
        return res.status(400).json({
            success: false,
            message
        });
    }

    unauthorized(res, message) {
        return res.status(401).json({
            success: false,
            message
        });
    }

    forbidden(res, message) {
        return res.status(403).json({
            success: false,
            message
        });
    }
}

export const responseHandler = new ResponseHandler();

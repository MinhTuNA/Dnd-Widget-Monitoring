
import axiosInstance from "./axiosConfig"

const getAllTables = () => {
    return axiosInstance.get("/api/auth-db/table_names");
}

const createTable = (tableName: string) => {
    return axiosInstance.post("/api/auth-db", {
        table_name: tableName,
    });
}

const getAllMemberInTable = (tableName: string) => {
    return axiosInstance.get("/api/auth-db/table/member", {
        params: { tableName: tableName }
    })
}

const updateMemberInTable = (tableName: string, id: number) => {
    return axiosInstance.patch("api/auth-db/update/member", {
        table_name: tableName,
        member: id,
    })
}


const removeMemberInTable = (tableName: string, id: number) => {
    return axiosInstance.delete("api/auth-db/remove/member", {
        params: {
            table_name: tableName,
            member: id,
        }
    })
}

const deleteTable = (tableName: string) => {
    return axiosInstance.delete(`/api/auth-db/${tableName}`);
}

const getAuthToken = (tableName: string) => {
    return axiosInstance.get("/api/auth-db/auth_token",
        {
            params: { tableName: tableName }
        }
    );
}

const getCameraId = (tableName: string) => {
    return axiosInstance.get("/api/auth-db/id_camera",
        {
            params: { tableName: tableName }
        }
    );
}

const setCameraId = (tableName: string, id: string) => {
    return axiosInstance.post("/api/auth-db/id_camera",
        {
            tableName: tableName,
            id_camera: id
        }
    );
}


const fetchAllEmployees = () => {
    return axiosInstance.get("/api/employees?sortBy=id&order=ASC");
};

const fetchAllMember = (page: number, limit: number) => {
    return axiosInstance.get("api/employees/member", {
        params: {
            page: page,
            limit: limit,
            sortBy: 'id',
            order: 'ASC'
        }
    });
};

const getMember = (employeeId: number) => {
    return axiosInstance.get(`/api/employees/${employeeId}`);
};

const UpdateMember = (
    employeeId: number,
    name: string,
    phoneNumber: string,
    email: string,
    isAdmin: boolean,
    password: string
) => {
    const data: Record<string, any> = {
        id: employeeId,
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        isAdmin: isAdmin,
    };

    if (password !== '') {
        data["pass"] = password;
    }

    return axiosInstance.patch("/api/employees", data, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};


const getDataNow = (tableNames: string[]) => {
    return axiosInstance.get("/api/auth-db/data/now", {
        params: { tableNames: tableNames },
    });
};

const getDataDay = (tableNames: string[]) => {
    return axiosInstance.get("/api/auth-db/data/day", {
        params: { tableNames: tableNames },
    });
};

const getDataInRange = (tableName: string, dateTimeStart: Date, dateTimeEnd: Date) => {
    return axiosInstance.get("api/auth-db/data/data_in_range", {
        params: {
            tableName: tableName,
            fromDate: dateTimeStart /*format(dateTimeStart, "yyyy-MM-dd HH:mm:ss")*/,
            toDate: dateTimeEnd /*format(dateTimeEnd, "yyyy-MM-dd HH:mm:ss")*/,
        },
    });
};

const sendTarget = (tableName: string, target: number) => {
    return axiosInstance.post(
        "/api/auth-db/data/target",
        {
            tableName: tableName,
            target: target,
        },
    );
};

const delMembers = (employeeId: number) => {
    return axiosInstance.delete(`/api/employees/${employeeId}`);
};

const CreateMemberAPI = (name: string, phoneNumber: string, email: string, isAdmin: boolean, password: string) => {

    return axiosInstance.post("/api/employees", {
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        isAdmin: isAdmin,
        pass: password
    });
};

const login = (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    return axiosInstance.post("/api/auth/login", params.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
};

const getUser = () => {
    return axiosInstance.get("/api/auth/profile");
}

const UpdateInfo = (id: string, phoneNumber: string, email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('phoneNumber', phoneNumber);
    params.append('email', email);
    if (password !== '') {
        params.append('pass', password);
    }

    return axiosInstance.patch("/api/employees", params.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
}

const register = (email: string, password: string) => {
    return axiosInstance.post("/register", {
        Email: email,
        Pass: password,
    });
}



export {
    getAllTables,
    getAllMemberInTable,
    createTable,
    deleteTable,
    fetchAllEmployees,
    fetchAllMember,
    updateMemberInTable,
    removeMemberInTable,
    getMember,
    UpdateMember,
    getDataNow,
    getDataDay,
    getDataInRange,
    sendTarget,
    delMembers,
    CreateMemberAPI,
    login,
    getUser,
    UpdateInfo,
    getAuthToken,
    getCameraId,
    setCameraId,
};
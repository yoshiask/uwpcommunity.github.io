import { Text, Stack, PrimaryButton, TextField, DefaultButton } from "office-ui-fabric-react";
import React from "react";
import { PostUser, PutUser } from "../../common/services/httpClient";
import { IBackendReponseError } from "../../common/interfaces";

interface IUserSubmission {
    name?: string;
    email?: string;
    discordId?: string;
};

export interface IRegisterDevProps {
    onCancel?: Function;
    onSuccess: Function;
};

export const RegisterDevForm = (props: IRegisterDevProps) => {
    let [userRequest, setUserRequest] = React.useState<IUserSubmission>();
    let [submissionStatus, setSubmissionStatus] = React.useState<string>("");

    /* Todo: Attempt to find an existing user in the DB and set this according, then prepopulate the fields below */
    let [modifying] = React.useState(false);

    async function addUser() {
        let request = modifying ? await PutUser(userRequest)
            : await PostUser(userRequest);

        let success = await request.status === 200;

        if (!success) {
            let error: IBackendReponseError = await request.json();
            if (error.error && error.reason) {
                setSubmissionStatus(error.reason);
            }
        } else {
            // Todo: show success indicator
        }
    }

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <Stack horizontalAlign="start" tokens={{ childrenGap: 10 }} style={{ maxWidth: "100%", width: "300px" }}>
                <TextField label="Developer name:"
                    description="Friendly name that users will see"
                    styles={{ root: { width: "100%" } }}
                    required
                    onChange={(e: any, value: any) => setUserRequest({ ...userRequest, name: value })} />

                <TextField label="Contact email:"
                    description="Optional"
                    styles={{ root: { width: "100%" } }}
                    onChange={(e: any, value: any) => setUserRequest({ ...userRequest, email: value })} />

                <Text style={{ color: "red" }}>{submissionStatus}</Text>
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <PrimaryButton text="Register"
                        onClick={addUser} />
                    {
                        props.onCancel ?
                            <DefaultButton text="Cancel" onClick={() => props.onCancel ? props.onCancel() : undefined} />
                            : ""
                    }
                </Stack>
            </Stack>
        </Stack>
    )
};
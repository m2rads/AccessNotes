import { FileNotFoundIcon } from "../../Icons/FileNotFoundIcon";

export const EmptyState = () => {
    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <FileNotFoundIcon />
                </div>
                <div style={{ color: 'white' }}>
                    <p>Annotations not found!</p>
                    <p>Please start by making a highlight on a web page.</p>
                </div>
            </div>
        </div>
    )
}
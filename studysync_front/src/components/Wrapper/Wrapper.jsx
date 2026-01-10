import WrapperStyle from './Wrapper.style.js';

const Wrapper = ({ children }) => {
    return (
        <div id="wrapper" style={WrapperStyle}>
            {children}
        </div>
    );
}

export default Wrapper;
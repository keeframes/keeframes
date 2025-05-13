import PropTypes from 'prop-types'; // prop types documents the intended types of properties passed to components -> will warn in development if they don't match
import { Link } from 'react-router-dom';

const LinkButton = ({ to, children, onClick, className, style }) => {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={className}
            style={style}
        >
            <button type="button">
                {children}
            </button>
        </Link>
    );
};

LinkButton.propTypes = {
    // REQUIRED
    to: PropTypes.string.isRequired, // url function
    children: PropTypes.node.isRequired, //  button content
    // OPTIONAL
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object
};

export default LinkButton;
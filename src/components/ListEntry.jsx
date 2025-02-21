import PropTypes from "prop-types";

const ListEntry = ({ text }) =>
{
    return(
        <div className="p-2 bg-white shadow rounded-md border border-gray-300">
            {text}
        </div>
    );
};

ListEntry.propTypes =
{
    text: PropTypes.string.isRequired,
};

export default ListEntry;

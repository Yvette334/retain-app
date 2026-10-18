interface Pagination {
    page: number;
    pages: number;
    onchange: (page: number) => void;
}

export default function page({page, pages, onchange}: Pagination){
    if(pages <= 1) return null

    return(
        <div className="pagination">
            <button className="btn" disabled ={page <= 1}  onClick={() => onchange(page - 1)}>Previous</button>
            <span>Page {page} of {pages}</span>
            <button className="btn" disabled ={page >= pages} onClick={() => onchange(page + 1)}>Next</button>
        </div>
    )
}
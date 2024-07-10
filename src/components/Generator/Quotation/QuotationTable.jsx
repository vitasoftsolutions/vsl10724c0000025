import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalUtilityStyle } from "../../../container/Styled";
import {
  openEditDrawer,
  setEditId,
} from "../../../redux/services/drawer/drawerSlice";
import {
  useDeleteQuotationMutation,
  useGetAllQuotationQuery,
} from "../../../redux/services/quotation/quotationApi";
import { usePagination } from "../../../utilities/hooks/usePagination";
import { useGlobalParams } from "../../../utilities/hooks/useParams";
import { useUrlIndexPermission } from "../../../utilities/lib/getPermission";
import { removeDeleteId } from "../../../utilities/lib/signleDeleteRow";
import DeleteModal from "../../Shared/Modal/DeleteModal";
import CustomTable from "../../Shared/Table/CustomTable";
import QuotationEdit from "./QuotationEdit";
import { QuotationDetails } from "./overview/QuotationDetails";
import { showCurrency } from "../../../utilities/lib/currency";
import { useCurrency } from "../../../redux/services/pos/posSlice";

const QuotationTable = ({
  newColumns,
  setSelectedRows,
  keyword,
  searchParams,
}) => {
  const dispatch = useDispatch();

  const { editId } = useSelector((state) => state.drawer);
  const currency = useSelector(useCurrency);

  const [detailsId, setDetailsId] = useState(undefined);
  const [detailsModal, setDetailsModal] = useState(false);

  const [deleteId, setDeleteId] = useState(undefined);
  const [deleteModal, setDeleteModal] = useState(false);

  const { pagination, updatePage, updatePageSize } = usePagination();

  const params = useGlobalParams({
    isDefaultParams: false,
    isRelationalParams: true,
    params: { ...pagination, ...searchParams },
    keyword,
  });

  const { data, isLoading } = useGetAllQuotationQuery(
    { params },
    {
      skip: !useUrlIndexPermission(),
    }
  );

  const total = data?.meta?.total;

  const [deleteQuotation, { isLoading: isDeleting }] =
    useDeleteQuotationMutation();

  const handleDetailsModal = (id) => {
    setDetailsId(id);
    setDetailsModal(true);
  };

  const handleEdit = (id) => {
    dispatch(setEditId(id));
    dispatch(openEditDrawer());
  };

  const handleDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    const { data } = await deleteQuotation(deleteId);
    if (data?.success) {
      setDeleteModal(false);
      removeDeleteId(setSelectedRows, deleteId);
    }
  };

  const dataSource =
    data?.results?.quotation?.map((item) => {
      const {
        id,
        reference_id,
        cashiers,
        customers,
        suppliers,
        grand_total,
        created_at,
        warehouses,
      } = item ?? {};
      const date = dayjs(created_at).format("DD-MM-YYYY");

      return {
        id,
        reference: reference_id,
        warehouse: warehouses?.name ?? "N/A",
        cashier: cashiers?.name ?? "N/A",
        customer: customers?.name ?? "N/A",
        supplier: suppliers?.name ?? "N/A",
        total: showCurrency(grand_total, currency),
        date,
        handleEdit,
        handleDeleteModal,
        handleDetailsModal,
      };
    }) ?? [];

  const hideModal = () => {
    // setStatusModal(false);
    setDetailsModal(false);
    setDeleteModal(false);
  };

  return (
    <GlobalUtilityStyle>
      <CustomTable
        columns={newColumns}
        dataSource={dataSource}
        total={total}
        pagination={pagination}
        updatePage={updatePage}
        updatePageSize={updatePageSize}
        setSelectedRows={setSelectedRows}
        isLoading={isLoading}
        isRowSelection={true}
        status={false}
        created_at={false}
      />

      <QuotationEdit id={editId} setId={setEditId} />

      {detailsId && (
        <QuotationDetails
          id={detailsId}
          openModal={detailsModal}
          hideModal={hideModal}
        />
      )}

      <DeleteModal
        deleteModal={deleteModal}
        hideModal={hideModal}
        handleDelete={handleDelete}
        isLoading={isDeleting}
        item={"quotation"}
      />
    </GlobalUtilityStyle>
  );
};

export default QuotationTable;

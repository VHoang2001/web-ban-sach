import {
  Badge,
  Button,
  FloatButton,
  Input,
  List,
  message,
  Modal,
  Table,
  Tooltip,
} from "antd";
import sach1 from "./assets/sach-1.jpg";
import sach2 from "./assets/sach-2.jpg";
import sach3 from "./assets/sach-3.jpg";
import sach4 from "./assets/sach-4.jpg";
import sach5 from "./assets/sach-5.jpg";
import sach6 from "./assets/sach-6.jpg";
import logoHutech from "./assets/logo-hutech.webp";
import paidImg from "./assets/paid.png";
import Marquee from "react-fast-marquee";
import {
  DeleteOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  MinusCircleOutlined,
  PhoneOutlined,
  PlusCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Margin, Resolution, usePDF } from "react-to-pdf";

const bookList = [
  {
    id: 1,
    name: "Có ai trưởng thành mà không vụn vỡ",
    price: 84000,
    discount: 72000,
    author: "23thang12",
    image: sach1,
  },
  {
    id: 2,
    name: "Yêu đi đừng sợ",
    price: 88000,
    discount: 74500,
    author: "Kim Oanh",
    image: sach2,
  },
  {
    id: 3,
    name: "Nếp Gấp Thời Gian - The Graphic Novel",
    price: 220000,
    discount: 187000,
    author: "Madeleine L’Engle",
    image: sach3,
  },
  {
    id: 4,
    name: "Bộ 4 Cuốn Cuộc Phiêu Lưu Của Dế Út",
    price: 220000,
    discount: 187000,
    author: "Madeleine L’Engle",
    image: sach4,
  },
  {
    id: 5,
    name: "Ngụ Ngôn La Fontaine",
    price: 75000,
    discount: 63500,
    author: "Jean de La Fontaine",
    image: sach5,
  },
  {
    id: 6,
    name: "Không Cần Được Lòng Tất Cả Mọi Người",
    price: 99000,
    discount: 84000,
    author: "Lee Pyeong",
    image: sach6,
  },
];

function App() {
  const date = new Date();
  const { toPDF, targetRef } = usePDF({
    method: "save",
    resolution: Resolution.HIGH,
    page: {
      orientation: "landscape",
      format: "letter",
      margin: Margin.MEDIUM,
    },
    filename: `invoice_${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}_${date
      .getHours()
      .toString()
      .padStart(2, "0")}-${date.getMinutes().toString().padStart(2, "0")}-${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}.pdf`,
  });
  const [messageApi, contextHolder] = message.useMessage();
  const getDataLocal = localStorage.getItem("data");
  const defaultData = getDataLocal ? JSON.parse(getDataLocal) : [];
  const [selectedBooks, setSelectedBooks] = useState(defaultData);
  const [showModalCart, setShowModalCart] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showModalInvoice, setShowModalInvoice] = useState(false);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dataCustomer, setDataCustomer] = useState({
    name: "Trường đại học Công nghệ Thành phố Hồ Chí Minh - HUTECH",
    phone: "02835120785",
    address:
      "10/80c Song Hành Xa Lộ Hà Nội, Phường Tân Phú, Quận 9, Hồ Chí Minh",
  });

  const columns = useMemo(
    () => [
      {
        title: "Tiêu đề sách",
        dataIndex: "name",
        key: "name",
        render: (text, record, index) => {
          const isLastRow = index === selectedBooks.length;
          return (
            <span style={{ fontWeight: isLastRow ? "bold" : "normal" }}>
              {text}
            </span>
          );
        },
      },
      {
        title: "Giá tiền",
        dataIndex: "discount",
        key: "discount",
        align: "center",
        render: (text) => (
          <NumericFormat value={text} thousandSeparator displayType="text" />
        ),
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        align: "center",
        render: (value, record, index) => {
          const isLastRow = index === selectedBooks.length;
          return isLastRow ? (
            <div className="font-bold text-[1.05rem]">{value}:</div>
          ) : (
            <NumericFormat value={value} thousandSeparator displayType="text" />
          );
        },
      },
      {
        title: "Thành tiền",
        key: "total",
        align: "center",
        dataIndex: "total",
        render: (value, record, index) => {
          const total = record.discount * record.quantity;
          const isLastRow = index === selectedBooks.length;

          return (
            <NumericFormat
              value={value || total}
              thousandSeparator
              displayType="text"
              className={isLastRow ? "font-bold text-[1.05rem]" : ""}
            />
          );
        },
      },
    ],
    [selectedBooks]
  );

  // Hàm xử lý khi nhấn nút "THÊM VÀO GIỎ HÀNG"
  const handleAddToCard = useCallback(
    (book) => {
      const isBookExist = selectedBooks.findIndex(
        (item) => item.id === book.id
      );

      const newBook = {
        ...book,
        quantity: 1,
      };

      if (isBookExist !== -1) {
        messageApi.open({
          type: "info",
          content: `"${book.name}" đã tồn tại trong giỏ hàng`,
        });
      } else {
        message.success(`Thêm "${book.name}" vào giỏ hàng`);
        setSelectedBooks([...selectedBooks, newBook]);
      }
    },
    [messageApi, selectedBooks]
  );

  const handleShowModalCart = useCallback(() => {
    setShowModalCart(true);
  }, []);

  const handleOk = useCallback(() => {
    setShowModalInfo(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShowModalCart(false);
  }, []);

  // Hàm xử lý khi thay đổi số lượng sách nhập vào từ INPUT
  const handleChangeQuantity = useCallback(
    (id, e) => {
      const newValue = parseFloat(e.target.value.replace(/,/g, ""));

      const dataSelectedBooks = [...selectedBooks];

      const updatedSelectedBooks = dataSelectedBooks.map((book) => {
        if (book.id === id) {
          return {
            ...book,
            quantity: Number.isNaN(newValue) ? 1 : newValue,
          };
        }
        return book;
      });

      setSelectedBooks(updatedSelectedBooks);
    },
    [selectedBooks]
  );

  // Hàm xử lý nhấn vào nút + sẽ TĂNG số lượng lên một cho một cuốn sách dựa vào ID của sách
  const handleIncrese = useCallback(
    (id) => {
      const dataSelectedBooks = [...selectedBooks];

      const updatedSelectedBooks = dataSelectedBooks.map((book) => {
        if (book.id === id) {
          return {
            ...book,
            quantity: book.quantity === 1000 ? 1000 : book.quantity + 1,
          };
        }
        return book;
      });

      setSelectedBooks(updatedSelectedBooks);
    },
    [selectedBooks]
  );

  // Hàm xử lý nhấn vào nút - sẽ GIẢM số lượng lên một cho một cuốn sách dựa vào ID của sách
  const handleDecrease = useCallback(
    (id) => {
      const dataSelectedBooks = [...selectedBooks];

      const updatedSelectedBooks = dataSelectedBooks.map((book) => {
        if (book.id === id) {
          return {
            ...book,
            quantity: book.quantity === 1 ? 1 : book.quantity - 1,
          };
        }
        return book;
      });

      setSelectedBooks(updatedSelectedBooks);
    },
    [selectedBooks]
  );

  // Hàm xử lý khi GIẢM số lượng một cuốn sách dựa vào ID của sách
  const handleDelete = useCallback(
    (id) => {
      const dataSelectedBooks = [...selectedBooks];

      const updatedSelectedBooks = dataSelectedBooks.filter(
        (book) => book.id !== id
      );

      setSelectedBooks(updatedSelectedBooks);
    },
    [selectedBooks]
  );

  // Hàm xử lý khi nhập vào thông tin khách hàng ( Họ tên, SDT, Địa chỉ )
  const handleChange = useCallback(
    (field, newValue) => {
      const updatedData = {
        ...dataCustomer,
        [field]: newValue,
      };

      setDataCustomer(updatedData);
    },
    [dataCustomer]
  );

  // Hàm in hóa đơn
  const handleExportInvoice = useCallback(() => {
    toPDF();
  }, [toPDF]);

  const handleOkModalInfo = useCallback(() => {
    setIsLoading(true);

    setTimeout(() => {
      message.success(
        "Thanh toán thành công. Hóa đơn của bạn sẽ được hiển thị trong giây lát"
      );
    }, 500);

    setTimeout(() => {
      setIsLoading(false);
      setShowModalCart(false);
      setShowModalInfo(false);
      setShowModalInvoice(true);
    }, 2000);
  }, []);

  const handleCancelModalInvoice = useCallback(() => {
    setShowModalInvoice(false);
    localStorage.setItem("data", JSON.stringify([]));
    setSelectedBooks([]);
    setDataCustomer({
      name: "Trường đại học Công nghệ Thành phố Hồ Chí Minh - HUTECH",
      phone: "02835120785",
      address:
        "10/80c Song Hành Xa Lộ Hà Nội, Phường Tân Phú, Quận 9, Hồ Chí Minh",
    });
  }, []);

  // Tính thành tiền
  useEffect(() => {
    const calculateTotal = selectedBooks.reduce((acc, cur) => {
      acc += cur.price * cur.quantity;
      return acc;
    }, 0);

    setTotal(calculateTotal);
  }, [selectedBooks]);

  // Lưu dữ liệu vào local storage
  useEffect(() => {
    const saveDataLocal = JSON.stringify(selectedBooks);

    localStorage.setItem("data", saveDataLocal);
  }, [selectedBooks]);

  return (
    <div className="container mx-auto py-8">
      {contextHolder}

      <div className="mb-10">
        <Marquee speed={100}>
          <span className="text-2xl italic">
            Chào mừng lễ quốc tế phụ nữ 20/10 giảm giá các loại sách từ{" "}
            <span className="text-red-500">10% - 50%</span>, số lượng có hạn
          </span>
        </Marquee>
      </div>

      <div className="text-2xl mb-4 font-bold text-blue-700">
        Sách bán chạy nhất
      </div>

      {/* Danh sách sách */}
      <div className="grid grid-cols-4 gap-x-8 gap-y-8">
        {bookList.map((book, index) => (
          <div key={index}>
            <div className="flex gap-x-4">
              <Badge.Ribbon
                color="red"
                text={`-${(
                  ((book.price - book.discount) / book.price) *
                  100
                ).toFixed(0)}%`}
              >
                <img
                  src={book.image}
                  alt={`book_img_${index}`}
                  style={{
                    width: "300px",
                    height: "250px",
                    objectFit: "cover",
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
              </Badge.Ribbon>

              <div className="flex flex-col gap-x-4 gap-y-4">
                <div className="text-[1.1rem] h-[50px] text-ellipsis overflow-hidden">
                  {book.name}
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="text-[1.3rem] text-orange-500">
                    <NumericFormat
                      value={book.discount}
                      displayType="text"
                      thousandSeparator
                      suffix="đ"
                    />
                  </span>
                  <span className="text-[1rem] line-through text-slate-500">
                    <NumericFormat
                      value={book.price}
                      displayType="text"
                      thousandSeparator
                      suffix="đ"
                    />
                  </span>
                </div>

                <Button
                  type="primary"
                  ghost
                  onClick={() => handleAddToCard(book)}
                >
                  <ShoppingCartOutlined />
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Giỏ hàng */}
      <FloatButton
        onClick={handleShowModalCart}
        tooltip="Giỏ hàng"
        type="primary"
        shape="square"
        style={{ insetInlineEnd: 24 }}
        icon={<ShoppingCartOutlined />}
        badge={{ count: selectedBooks.length }}
      />

      {/* Modal Giỏ hàng */}
      <Modal
        maskClosable={false}
        open={showModalCart}
        onOk={handleOk}
        onCancel={handleCancel}
        width={"60%"}
        title={
          <span className="uppercase text-[1.1rem] text-blue-700">
            Giỏ hàng
          </span>
        }
        footer={[
          <div key="total" className="flex mt-4">
            <Button className="font-bold">
              Tổng tiền ({selectedBooks.length} sản phẩm):{" "}
              <NumericFormat
                value={total}
                displayType="text"
                thousandSeparator
                suffix="đ"
                className="text-blue-700 text-xl p-2"
              />
            </Button>
          </div>,
          <Button key="cancel" onClick={handleCancel}>
            Tiếp tục mua
          </Button>,
          <Button
            disabled={selectedBooks.length === 0}
            key="ok"
            type="primary"
            onClick={handleOk}
          >
            Thanh toán và xuất hóa đơn
          </Button>,
        ]}
      >
        <List
          className="max-h-[400px] border rounded-lg px-2 overflow-y-auto"
          itemLayout="horizontal"
          dataSource={selectedBooks}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <div
                  key="handle-quantity"
                  className="flex items-center gap-x-4"
                >
                  <div>Số lượng: </div>
                  <Button onClick={() => handleDecrease(item.id)}>
                    <MinusCircleOutlined />
                  </Button>

                  <div>
                    <NumericFormat
                      allowLeadingZeros={false}
                      allowNegative={false}
                      decimalScale={0}
                      customInput={Input}
                      thousandSeparator
                      value={item.quantity}
                      className="!w-[100px]"
                      onChange={(e) => handleChangeQuantity(item.id, e)}
                      isAllowed={(values) =>
                        values.value >= 1 && values.value <= 1000
                      }
                    />
                  </div>

                  <Button onClick={() => handleIncrese(item.id)}>
                    <PlusCircleOutlined />
                  </Button>
                </div>,

                <div className="ml-10" key="delete-item">
                  <Tooltip title="Xóa">
                    <Button
                      onClick={() => handleDelete(item.id)}
                      danger
                      type="primary"
                    >
                      <DeleteOutlined />
                    </Button>
                  </Tooltip>
                </div>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span className="font-bold">
                    {index + 1}. {item.name}
                  </span>
                }
                description={
                  <div className="flex items-center gap-x-2">
                    <NumericFormat
                      thousandSeparator
                      displayType="text"
                      className="text-orange-500"
                      value={item.discount}
                      suffix="đ"
                    />

                    <div>
                      x{" "}
                      <NumericFormat
                        thousandSeparator
                        displayType="text"
                        value={item.quantity}
                        suffix=" cuốn"
                      />{" "}
                      ={" "}
                      <NumericFormat
                        thousandSeparator
                        displayType="text"
                        className="text-orange-500"
                        value={item.discount * item.quantity}
                        suffix="đ"
                      />
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal Thông tin */}
      <Modal
        open={showModalInfo}
        okText="Tiếp tục"
        cancelText="Đóng"
        onCancel={() => setShowModalInfo(false)}
        onOk={handleOkModalInfo}
        maskClosable={false}
        okButtonProps={{
          loading: isLoading,
        }}
        title={
          <span className="uppercase text-[1.1rem] text-blue-700">
            Nhập thông tin nhận hàng
          </span>
        }
      >
        <div>
          Có thể bỏ qua và nhấn <span className="font-bold">Tiếp tục</span> để
          sử dụng thông tin mặc định
        </div>
        <div className="flex flex-col gap-y-5 mt-7 mb-5">
          <Input
            size="large"
            placeholder="Họ và tên"
            onChange={(e) => handleChange("name", e.target.value)}
            prefix={<UserOutlined />}
          />
          <Input
            size="large"
            placeholder="Số điện thoại"
            prefix={<PhoneOutlined />}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <Input
            size="large"
            placeholder="Địa chỉ nhận hàng"
            prefix={<EnvironmentOutlined />}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        open={showModalInvoice}
        width={"80%"}
        maskClosable={false}
        closeIcon={false}
        footer={[
          <Button key="cancel" onClick={handleCancelModalInvoice}>
            Đóng
          </Button>,
          <Button key="ok" type="primary" onClick={handleExportInvoice}>
            <DownloadOutlined /> Tải xuống hóa đơn
          </Button>,
        ]}
      >
        {/* In hóa đơn */}
        <div ref={targetRef}>
          <div className="flex items-center justify-center flex-col gap-y-5">
            <img src={logoHutech} width={200} />

            <div className="flex flex-col items-center mb-2">
              <div className="text-[1.5rem] text-blue-700 font-bold">
                HÓA ĐƠN ĐIỆN TỬ
              </div>
              <div>
                Số hóa đơn:{" "}
                <span className="text-red-500 font-bold">A0001</span>
              </div>
            </div>
          </div>

          <div className="flex gap-x-2">
            <div className="flex flex-col gap-y-2 w-[10%]">
              <div>Khách hàng:</div>
              <div>Số điện thoại:</div>
              <div>Địa chỉ:</div>
            </div>

            <div className="flex flex-col gap-y-2 w-full">
              <div>{dataCustomer.name}</div>
              <div>{dataCustomer.phone}</div>
              <div>{dataCustomer.address}</div>
            </div>
          </div>

          <div className="relative mt-4 mb-2 flex justify-between items-center ">
            <div className="text-[1.1rem] font-bold text-blue-700 ">
              Danh sách sản phẩm
            </div>
            <div>
              TP.HCM, ngày {date.getDate()} tháng {date.getMonth() + 1} năm{" "}
              {date.getFullYear()}
            </div>

            <div className="absolute right-0 -top-[180px] z-[99] select-none">
              <img src={paidImg} width={250} />
            </div>
          </div>

          <Table
            bordered
            className="mb-4"
            dataSource={[
              ...selectedBooks,
              {
                quantity: "Tổng",
                total: total,
              },
            ]}
            columns={columns}
            pagination={false}
          />
        </div>
      </Modal>
    </div>
  );
}

export default App;

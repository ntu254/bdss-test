import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Droplets, HeartPulse, Handshake, CheckCircle, Info, Beaker, GitCompareArrows, FileText, HeartHandshake, UserCheck, Stethoscope, Syringe } from 'lucide-react';

import bloodTypeService from '../services/bloodTypeService';
import bloodCompatibilityService from '../services/bloodCompatibilityService';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Component con cho từng thẻ thông tin phân bố nhóm máu
const BloodTypeDistributionCard = ({ type, percentage, description, isRare }) => (
    <div className={`bg-white p-4 rounded-lg shadow-md border ${isRare ? 'border-red-200' : 'border-gray-200'}`}>
        <p className={`text-2xl font-bold ${isRare ? 'text-red-700' : 'text-gray-800'}`}>{type}</p>
        <p className="text-3xl font-bold text-red-600 my-2">{percentage}</p>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

const BloodCompatibilityCheckerPage = () => {
    // State quản lý tab chính và tab phụ
    const [activeTab, setActiveTab] = useState('compatibility'); // Mặc định mở tab compatibility
    const [activeSubTab, setActiveSubTab] = useState('whole'); // 'whole', 'components'

    // State cho dữ liệu API
    const [allBloodTypes, setAllBloodTypes] = useState([]);
    const [compatibilityRules, setCompatibilityRules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State cho dropdowns
    const [wholeBloodTypes, setWholeBloodTypes] = useState([]);
    const [bloodGroups, setBloodGroups] = useState([]);
    const [componentTypes, setComponentTypes] = useState([]);

    // State cho việc lựa chọn và tính toán
    const [selectedWholeBloodId, setSelectedWholeBloodId] = useState('');
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
    const [selectedComponent, setSelectedComponent] = useState('');
    const [compatibleDonors, setCompatibleDonors] = useState([]);
    const [compatibleRecipients, setCompatibleRecipients] = useState([]);

    // --- Data Fetching & Preparation ---
    const fetchBloodData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [typesResponse, rulesResponse] = await Promise.all([
                bloodTypeService.getAll(),
                bloodCompatibilityService.getAll(0, 1000)
            ]);

            const allTypes = typesResponse || [];
            const allRules = rulesResponse.content || [];

            setAllBloodTypes(allTypes);
            setCompatibilityRules(allRules);
            setAllBloodTypes(allTypes);
            setCompatibilityRules(allRules);

            const wholeTypes = allTypes.filter(bt => bt.componentType === 'Whole Blood');
            setWholeBloodTypes(wholeTypes);

            const uniqueGroups = [...new Set(allTypes.map(t => t.bloodGroup))];
            const uniqueComponents = [...new Set(allTypes.map(t => t.componentType))].filter(c => c !== 'Whole Blood');

            setBloodGroups(uniqueGroups);
            setComponentTypes(uniqueComponents);

            if (wholeTypes.length > 0) {
                setSelectedWholeBloodId(String(wholeTypes[0].id));
            }
            if (uniqueGroups.length > 0) {
                setSelectedBloodGroup(uniqueGroups[0]);
            }
            if (uniqueComponents.length > 0) {
                setSelectedComponent(uniqueComponents[0]);
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Đã có lỗi xảy ra.";
            toast.error("Lỗi khi tải dữ liệu: " + errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBloodData();
    }, [fetchBloodData]);

    // --- Logic tính toán tương thích ---
    useEffect(() => {
        let targetTypeId = null;
        if (activeSubTab === 'whole') {
            targetTypeId = parseInt(selectedWholeBloodId, 10);
        } else {
            const foundType = allBloodTypes.find(bt => bt.bloodGroup === selectedBloodGroup && bt.componentType === selectedComponent);
            if (foundType) {
                targetTypeId = foundType.id;
            }
        }

        if (targetTypeId && compatibilityRules.length > 0) {
            const donors = new Set();
            compatibilityRules.forEach(rule => {
                if (rule.recipientBloodType?.id === targetTypeId && rule.isCompatible) {
                    donors.add(rule.donorBloodType.description); // Lấy mô tả đầy đủ
                }
            });
            setCompatibleDonors(Array.from(donors));

            const recipients = new Set();
            compatibilityRules.forEach(rule => {
                if (rule.donorBloodType?.id === targetTypeId && rule.isCompatible) {
                    recipients.add(rule.recipientBloodType.description); // Lấy mô tả đầy đủ
                }
            });
            setCompatibleRecipients(Array.from(recipients));
        } else {
            setCompatibleDonors([]);
            setCompatibleRecipients([]);
        }
    }, [selectedWholeBloodId, selectedBloodGroup, selectedComponent, activeSubTab, allBloodTypes, compatibilityRules]);

    // --- Render Functions cho từng Tab ---

    const renderBloodTypesTab = () => (
        <div className="animate-modal-appear space-y-10">
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Tìm hiểu về các Nhóm máu</h2>
                <p className="text-gray-600 mb-4">Tìm hiểu về các loại máu khác nhau và sự phân bố của chúng trong dân số.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-red-700">Hệ thống nhóm máu ABO</h3>
                        <p className="text-gray-700">Hệ thống ABO phân loại máu thành bốn loại chính: A, B, AB và O, dựa trên sự hiện diện hoặc vắng mặt của kháng nguyên A và B.</p>
                        <h3 className="text-xl font-semibold text-red-700">Yếu tố Rh</h3>
                        <p className="text-gray-700">Yếu tố Rh là một kháng nguyên khác trên hồng cầu. Nếu có, nhóm máu là dương (+); nếu không, là âm (-).</p>
                    </div>
                    <div className="flex justify-center items-center bg-gray-100 rounded-lg p-8">
                        <Droplets size={100} className="text-red-300" />
                    </div>
                </div>
            </section>
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Phân bố Nhóm máu (Tham khảo)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <BloodTypeDistributionCard type="O+" percentage="38%" description="Phổ biến nhất" />
                    <BloodTypeDistributionCard type="A+" percentage="34%" description="Phổ biến thứ hai" />
                    <BloodTypeDistributionCard type="B+" percentage="9%" description="Ít phổ biến" />
                    <BloodTypeDistributionCard type="AB+" percentage="3%" description="Hiếm nhất" />
                    <BloodTypeDistributionCard type="O-" percentage="7%" description="Người cho toàn năng" isRare />
                    <BloodTypeDistributionCard type="A-" percentage="6%" description="Ít phổ biến" isRare />
                    <BloodTypeDistributionCard type="B-" percentage="2%" description="Hiếm" isRare />
                    <BloodTypeDistributionCard type="AB-" percentage="1%" description="Hiếm nhất" isRare />
                </div>
            </section>
        </div>
    );

    const renderCompatibilityTab = () => (
        <div className="animate-modal-appear space-y-8">
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveSubTab('whole')}
                    className={`px-4 py-2 text-sm font-medium ${activeSubTab === 'whole' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Máu Toàn Phần
                </button>
                <button
                    onClick={() => setActiveSubTab('components')}
                    className={`px-4 py-2 text-sm font-medium ${activeSubTab === 'components' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Thành Phần Máu
                </button>
            </div>

            {isLoading ? <div className="flex justify-center items-center py-10"><LoadingSpinner /></div> : (
                <div className="p-4 bg-red-50 rounded-lg shadow-inner">
                    {/* Content for sub-tabs */}
                    {activeSubTab === 'whole' ? (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tra cứu tương thích Máu Toàn Phần</h3>
                            <label htmlFor="selectWholeBloodType" className="block text-base font-medium text-gray-700 mb-2">Chọn nhóm máu:</label>
                            <select
                                id="selectWholeBloodType"
                                value={selectedWholeBloodId}
                                onChange={(e) => setSelectedWholeBloodId(e.target.value)}
                                className="block w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                            >
                                {wholeBloodTypes.map(bt => <option key={bt.id} value={bt.id}>{bt.bloodGroup}</option>)}
                            </select>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tra cứu tương thích theo Thành Phần Máu</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="selectBloodGroup" className="block text-base font-medium text-gray-700 mb-2">Chọn nhóm máu:</label>
                                    <select
                                        id="selectBloodGroup"
                                        value={selectedBloodGroup}
                                        onChange={(e) => setSelectedBloodGroup(e.target.value)}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    >
                                        {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="selectComponent" className="block text-base font-medium text-gray-700 mb-2">Chọn thành phần:</label>
                                    <select
                                        id="selectComponent"
                                        value={selectedComponent}
                                        onChange={(e) => setSelectedComponent(e.target.value)}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    >
                                        {componentTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Display */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-md shadow-sm border border-green-200">
                            <h3 className="text-lg font-semibold text-green-700 flex items-center mb-3"><Handshake size={20} className="mr-2" /> Có thể Hiến cho</h3>
                            <div className="flex flex-wrap gap-2">
                                {compatibleRecipients.length > 0 ? compatibleRecipients.map(bg => (
                                    <span key={bg} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">{bg}</span>
                                )) : <p className="text-gray-500 italic text-sm">Không tìm thấy kết quả phù hợp.</p>}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md shadow-sm border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-700 flex items-center mb-3"><HeartPulse size={20} className="mr-2" /> Có thể Nhận từ</h3>
                            <div className="flex flex-wrap gap-2">
                                {compatibleDonors.length > 0 ? compatibleDonors.map(bg => (
                                    <span key={bg} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{bg}</span>
                                )) : <p className="text-gray-500 italic text-sm">Không tìm thấy kết quả phù hợp.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Lưu ý Tương thích Đặc biệt</h3>
                <div className="space-y-3 text-gray-700">
                    <p><strong className="text-red-600">Người cho toàn năng (Hồng cầu):</strong> O- có thể hiến hồng cầu cho bất kỳ ai vì không có kháng nguyên A, B, hoặc Rh.</p>
                    <p><strong className="text-red-600">Người nhận toàn năng (Hồng cầu):</strong> AB+ có thể nhận hồng cầu từ bất kỳ ai vì họ có cả kháng nguyên A, B và Rh, không tạo ra kháng thể chống lại chúng.</p>
                    <p><strong className="text-gray-600">Tương thích Huyết tương:</strong> Quy tắc tương thích huyết tương ngược lại với hồng cầu. AB là người cho huyết tương toàn năng, trong khi O là người nhận toàn năng.</p>
                </div>
            </section>
        </div>
    );

    const renderDonationProcessTab = () => (
        <div className="animate-modal-appear space-y-10">
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Quy Trình Hiến Máu</h2>
                <p className="text-gray-600">Những điều bạn cần biết khi tham gia hiến máu tại cơ sở của chúng tôi.</p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold text-red-700 mb-3">Trước khi Hiến máu</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Ngủ đủ giấc vào đêm trước.</li>
                        <li>Ăn nhẹ trong vòng 3 giờ trước khi hiến máu.</li>
                        <li>Uống nhiều nước trước và sau khi hiến.</li>
                        <li>Mang theo giấy tờ tùy thân và danh sách thuốc (nếu có).</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-red-700 mb-3">Điều kiện Tham gia</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Từ 17 tuổi trở lên.</li>
                        <li>Cân nặng ít nhất 50 kg.</li>
                        <li>Có sức khỏe tốt, không mắc bệnh truyền nhiễm.</li>
                        <li>Không hiến máu toàn phần trong 56 ngày qua.</li>
                    </ul>
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Các bước trong Quy trình</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <UserCheck size={40} className="mx-auto text-red-500 mb-3" />
                        <h4 className="font-semibold text-lg">Đăng ký</h4>
                        <p className="text-sm text-gray-600 mt-1">Điền phiếu đăng ký và đọc các tài liệu hướng dẫn.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <Stethoscope size={40} className="mx-auto text-red-500 mb-3" />
                        <h4 className="font-semibold text-lg">Khám sàng lọc</h4>
                        <p className="text-sm text-gray-600 mt-1">Nhân viên y tế sẽ kiểm tra huyết áp, nhiệt độ, và hemoglobin.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <Syringe size={40} className="mx-auto text-red-500 mb-3" />
                        <h4 className="font-semibold text-lg">Hiến máu</h4>
                        <p className="text-sm text-gray-600 mt-1">Quá trình lấy máu chỉ mất khoảng 8-10 phút. Sau đó bạn sẽ nghỉ ngơi tại chỗ.</p>
                    </div>
                </div>
            </section>
        </div>
    );

    // -- Cấu trúc render chính của trang --
    return (
        <>
            <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto pt-16">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                        <HeartHandshake size={32} className="text-red-600 mr-3" /> Cẩm Nang Hiến Máu
                    </h1>

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex justify-center space-x-6">
                            <button onClick={() => setActiveTab('types')} className={`px-3 py-3 font-medium text-sm border-b-2 ${activeTab === 'types' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <Info className="inline-block mr-2" size={16} /> Nhóm Máu
                            </button>
                            <button onClick={() => setActiveTab('compatibility')} className={`px-3 py-3 font-medium text-sm border-b-2 ${activeTab === 'compatibility' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <GitCompareArrows className="inline-block mr-2" size={16} /> Tương Thích
                            </button>
                            <button onClick={() => setActiveTab('process')} className={`px-3 py-3 font-medium text-sm border-b-2 ${activeTab === 'process' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <FileText className="inline-block mr-2" size={16} /> Quy Trình
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                        {activeTab === 'types' && renderBloodTypesTab()}
                        {activeTab === 'compatibility' && renderCompatibilityTab()}
                        {activeTab === 'process' && renderDonationProcessTab()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BloodCompatibilityCheckerPage;
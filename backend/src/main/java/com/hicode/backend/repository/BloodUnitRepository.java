package com.hicode.backend.repository;

import com.hicode.backend.dto.admin.InventorySummary;
import com.hicode.backend.model.entity.BloodUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodUnitRepository extends JpaRepository<BloodUnit, String> {
    /**
     * Thống kê số lượng đơn vị và tổng thể tích cho mỗi nhóm máu đang có sẵn.
     * Sử dụng constructor của DTO để tạo đối tượng kết quả trực tiếp.
     */
    @Query("SELECT new com.hicode.backend.dto.admin.InventorySummary(bu.bloodType, COUNT(bu.id), SUM(bu.volumeMl)) " +
            "FROM BloodUnit bu " +
            "WHERE bu.status = com.hicode.backend.model.enums.InventoryStatus.AVAILABLE " +
            "GROUP BY bu.bloodType")
    List<InventorySummary> getInventorySummary();

    /**
     * Lấy danh sách các đơn vị máu mới được thêm vào kho, sắp xếp theo ngày lấy máu giảm dần.
     */
    List<BloodUnit> findTop10ByOrderByCollectionDateDesc();

}